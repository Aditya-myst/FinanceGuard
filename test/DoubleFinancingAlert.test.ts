import { expect } from "chai";
import hre from "hardhat";
import { DoubleFinancingAlert } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DoubleFinancingAlert", function () {
  let doubleFinancingAlert: DoubleFinancingAlert;
  let owner: SignerWithAddress;
  let financier1: SignerWithAddress;
  let financier2: SignerWithAddress;
  let financier3: SignerWithAddress;
  let propertyHash: string;
  const MORTGAGE_AMOUNT = hre.ethers.parseEther("1");

  beforeEach(async function () {
    // Get signers
    [owner, financier1, financier2, financier3] = await hre.ethers.getSigners();

    // Deploy contract
    const DoubleFinancingAlert = await hre.ethers.getContractFactory("DoubleFinancingAlert");
    doubleFinancingAlert = await DoubleFinancingAlert.deploy();
    await doubleFinancingAlert.waitForDeployment();

    // Create a property hash
    propertyHash = hre.ethers.keccak256(
      hre.ethers.solidityPacked(
        ["string", "uint256"],
        ["123 Main Street, City", 12345]
      )
    );
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await doubleFinancingAlert.getAddress()).to.be.properAddress;
    });

    it("Should have correct initial state", async function () {
      const isFinanced = await doubleFinancingAlert.checkPropertyStatus(propertyHash);
      expect(isFinanced).to.be.false;
    });
  });

  describe("Mortgage Registration", function () {
    it("Should register a new mortgage successfully", async function () {
      await expect(
        doubleFinancingAlert
          .connect(financier1)
          .registerMortgage(propertyHash, MORTGAGE_AMOUNT)
      ).to.emit(doubleFinancingAlert, "MortgageRegistered");

      const isFinanced = await doubleFinancingAlert.checkPropertyStatus(propertyHash);
      expect(isFinanced).to.be.true;
    });

    it("Should revert when registering with invalid property hash", async function () {
      const invalidHash = hre.ethers.ZeroHash;
      await expect(
        doubleFinancingAlert
          .connect(financier1)
          .registerMortgage(invalidHash, MORTGAGE_AMOUNT)
      ).to.be.revertedWith("Invalid property hash");
    });

    it("Should revert when amount is zero", async function () {
      await expect(
        doubleFinancingAlert
          .connect(financier1)
          .registerMortgage(propertyHash, 0)
      ).to.be.revertedWith("Amount must be greater than zero");
    });

    it("Should store correct mortgage details", async function () {
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(propertyHash, MORTGAGE_AMOUNT);

      const [financier, timestamp, isActive, amount] = 
        await doubleFinancingAlert.getMortgageDetails(propertyHash);

      expect(financier).to.equal(financier1.address);
      expect(isActive).to.be.true;
      expect(timestamp).to.be.gt(0);
      expect(amount).to.equal(MORTGAGE_AMOUNT);
    });

    it("Should add property to financier's property list", async function () {
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(propertyHash, MORTGAGE_AMOUNT);

      const properties = await doubleFinancingAlert.getFinancierProperties(financier1.address);
      expect(properties.length).to.equal(1);
      expect(properties[0]).to.equal(propertyHash);
    });
  });

  describe("Double Financing Detection", function () {
    beforeEach(async function () {
      // Register initial mortgage
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(propertyHash, MORTGAGE_AMOUNT);
    });

    it("Should detect and alert on double financing attempt", async function () {
      // The transaction should revert but emit the event first
      await expect(
        doubleFinancingAlert
          .connect(financier2)
          .registerMortgage(propertyHash, MORTGAGE_AMOUNT)
      ).to.be.revertedWith("Double financing detected! Alert sent to primary financier.");
    });

    it("Should revert with double financing message", async function () {
      await expect(
        doubleFinancingAlert
          .connect(financier2)
          .registerMortgage(propertyHash, MORTGAGE_AMOUNT)
      ).to.be.revertedWith("Double financing detected! Alert sent to primary financier.");
    });

    it("Should not change mortgage details on double financing attempt", async function () {
      try {
        await doubleFinancingAlert
          .connect(financier2)
          .registerMortgage(propertyHash, MORTGAGE_AMOUNT);
      } catch (error) {
        // Expected to fail
      }

      const [financier] = await doubleFinancingAlert.getMortgageDetails(propertyHash);
      expect(financier).to.equal(financier1.address);
    });

    it("Should not add property to second financier's list", async function () {
      try {
        await doubleFinancingAlert
          .connect(financier2)
          .registerMortgage(propertyHash, MORTGAGE_AMOUNT);
      } catch (error) {
        // Expected to fail
      }

      const properties = await doubleFinancingAlert.getFinancierProperties(financier2.address);
      expect(properties.length).to.equal(0);
    });
  });

  describe("Close Mortgage", function () {
    beforeEach(async function () {
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(propertyHash, MORTGAGE_AMOUNT);
    });

    it("Should allow financier to close their mortgage", async function () {
      await expect(
        doubleFinancingAlert.connect(financier1).closeMortgage(propertyHash)
      ).to.emit(doubleFinancingAlert, "MortgageClosed");

      const isFinanced = await doubleFinancingAlert.checkPropertyStatus(propertyHash);
      expect(isFinanced).to.be.false;
    });

    it("Should update mortgage status to inactive", async function () {
      await doubleFinancingAlert.connect(financier1).closeMortgage(propertyHash);

      const [, , isActive] = await doubleFinancingAlert.getMortgageDetails(propertyHash);
      expect(isActive).to.be.false;
    });

    it("Should revert if non-financier tries to close mortgage", async function () {
      await expect(
        doubleFinancingAlert.connect(financier2).closeMortgage(propertyHash)
      ).to.be.revertedWith("Only financier can perform this action");
    });

    it("Should revert when closing non-existent mortgage", async function () {
      const newPropertyHash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string"], ["Non-existent property"])
      );

      await expect(
        doubleFinancingAlert.connect(financier1).closeMortgage(newPropertyHash)
      ).to.be.revertedWith("Property not financed");
    });

    it("Should allow re-registration after closing", async function () {
      await doubleFinancingAlert.connect(financier1).closeMortgage(propertyHash);

      await expect(
        doubleFinancingAlert
          .connect(financier2)
          .registerMortgage(propertyHash, MORTGAGE_AMOUNT)
      ).to.emit(doubleFinancingAlert, "MortgageRegistered");

      const [financier] = await doubleFinancingAlert.getMortgageDetails(propertyHash);
      expect(financier).to.equal(financier2.address);
    });

    it("Should revert when trying to close already closed mortgage", async function () {
      await doubleFinancingAlert.connect(financier1).closeMortgage(propertyHash);

      await expect(
        doubleFinancingAlert.connect(financier1).closeMortgage(propertyHash)
      ).to.be.revertedWith("Property not financed");
    });
  });

  describe("Helper Functions", function () {
    it("Should hash property details correctly", async function () {
      const address = "123 Main Street";
      const id = 12345;

      const hash = await doubleFinancingAlert.hashPropertyDetails(address, id);
      const expectedHash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], [address, id])
      );

      expect(hash).to.equal(expectedHash);
    });

    it("Should return correct property status", async function () {
      expect(await doubleFinancingAlert.checkPropertyStatus(propertyHash)).to.be.false;

      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(propertyHash, MORTGAGE_AMOUNT);

      expect(await doubleFinancingAlert.checkPropertyStatus(propertyHash)).to.be.true;
    });

    it("Should generate different hashes for different properties", async function () {
      const hash1 = await doubleFinancingAlert.hashPropertyDetails("Property A", 1);
      const hash2 = await doubleFinancingAlert.hashPropertyDetails("Property B", 2);

      expect(hash1).to.not.equal(hash2);
    });

    it("Should return correct financier property count", async function () {
      const property1Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 1", 1])
      );
      const property2Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 2", 2])
      );

      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(property1Hash, MORTGAGE_AMOUNT);
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(property2Hash, MORTGAGE_AMOUNT);

      const count = await doubleFinancingAlert.getFinancierPropertyCount(financier1.address);
      expect(count).to.equal(2);
    });
  });

  describe("Multiple Properties", function () {
    it("Should handle multiple different properties", async function () {
      const property1Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 1", 1])
      );
      const property2Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 2", 2])
      );

      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(property1Hash, MORTGAGE_AMOUNT);
      await doubleFinancingAlert
        .connect(financier2)
        .registerMortgage(property2Hash, MORTGAGE_AMOUNT);

      expect(await doubleFinancingAlert.checkPropertyStatus(property1Hash)).to.be.true;
      expect(await doubleFinancingAlert.checkPropertyStatus(property2Hash)).to.be.true;

      const [financier1Address] = await doubleFinancingAlert.getMortgageDetails(property1Hash);
      const [financier2Address] = await doubleFinancingAlert.getMortgageDetails(property2Hash);

      expect(financier1Address).to.equal(financier1.address);
      expect(financier2Address).to.equal(financier2.address);
    });

    it("Should allow same financier to finance multiple properties", async function () {
      const property1Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 1", 1])
      );
      const property2Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 2", 2])
      );
      const property3Hash = hre.ethers.keccak256(
        hre.ethers.solidityPacked(["string", "uint256"], ["Property 3", 3])
      );

      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(property1Hash, MORTGAGE_AMOUNT);
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(property2Hash, MORTGAGE_AMOUNT);
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(property3Hash, MORTGAGE_AMOUNT);

      const properties = await doubleFinancingAlert.getFinancierProperties(financier1.address);
      expect(properties.length).to.equal(3);
      expect(properties).to.include(property1Hash);
      expect(properties).to.include(property2Hash);
      expect(properties).to.include(property3Hash);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero address financier lookup", async function () {
      const properties = await doubleFinancingAlert.getFinancierProperties(hre.ethers.ZeroAddress);
      expect(properties.length).to.equal(0);
    });

    it("Should handle property with no mortgage", async function () {
      const [financier, timestamp, isActive, amount] = 
        await doubleFinancingAlert.getMortgageDetails(propertyHash);

      expect(financier).to.equal(hre.ethers.ZeroAddress);
      expect(timestamp).to.equal(0);
      expect(isActive).to.be.false;
      expect(amount).to.equal(0);
    });

    it("Should handle large mortgage amounts", async function () {
      const largeAmount = hre.ethers.parseEther("1000000");
      
      await doubleFinancingAlert
        .connect(financier1)
        .registerMortgage(propertyHash, largeAmount);

      const [, , , amount] = await doubleFinancingAlert.getMortgageDetails(propertyHash);
      expect(amount).to.equal(largeAmount);
    });
  });
});
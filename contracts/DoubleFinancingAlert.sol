// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DoubleFinancingAlert
 * @dev A smart contract to detect and prevent double financing of properties
 * @notice This contract maintains privacy by using hashed property details
 */
contract DoubleFinancingAlert {
    
    // Struct to store mortgage information
    struct Mortgage {
        bytes32 propertyHash;      // Hashed property details for privacy
        address financier;         // Address of the financier
        uint256 timestamp;         // Time of registration
        bool isActive;            // Status of the mortgage
        uint256 amount;           // Mortgage amount (optional)
    }

    // Mapping from property hash to mortgage details
    mapping(bytes32 => Mortgage) public mortgages;
    
    // Mapping to track if a property has been financed
    mapping(bytes32 => bool) public isPropertyFinanced;
    
    // Mapping to track financier's properties
    mapping(address => bytes32[]) public financierProperties;
    
    // Events - Renamed to avoid shadowing
    event MortgageRegistered(
        bytes32 indexed propertyHash,
        address indexed financier,
        uint256 timestamp,
        uint256 amount
    );
    
    event DoubleFinancingDetected(
        bytes32 indexed propertyHash,
        address indexed primaryFinancier,
        address indexed attemptedFinancier,
        uint256 timestamp
    );
    
    event MortgageClosed(
        bytes32 indexed propertyHash,
        address indexed financier,
        uint256 timestamp
    );

    // Modifiers
    modifier validPropertyHash(bytes32 _propertyHash) {
        require(_propertyHash != bytes32(0), "Invalid property hash");
        _;
    }

    modifier onlyFinancier(bytes32 _propertyHash) {
        require(isPropertyFinanced[_propertyHash], "Property not financed");
        require(
            mortgages[_propertyHash].financier == msg.sender,
            "Only financier can perform this action"
        );
        _;
    }

    /**
     * @dev Register a new mortgage for a property
     * @param _propertyHash Hashed property details
     * @param _amount Mortgage amount
     */
    function registerMortgage(bytes32 _propertyHash, uint256 _amount) 
        public 
        validPropertyHash(_propertyHash) 
    {
        require(_amount > 0, "Amount must be greater than zero");
        
        // Check if property is already financed
        if (isPropertyFinanced[_propertyHash]) {
            // Trigger double financing alert
            emit DoubleFinancingDetected(
                _propertyHash,
                mortgages[_propertyHash].financier,
                msg.sender,
                block.timestamp
            );
            revert("Double financing detected! Alert sent to primary financier.");
        }
        
        // Register the mortgage
        mortgages[_propertyHash] = Mortgage({
            propertyHash: _propertyHash,
            financier: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            amount: _amount
        });
        
        isPropertyFinanced[_propertyHash] = true;
        financierProperties[msg.sender].push(_propertyHash);
        
        emit MortgageRegistered(_propertyHash, msg.sender, block.timestamp, _amount);
    }

    /**
     * @dev Close an existing mortgage
     * @param _propertyHash Hashed property details
     */
    function closeMortgage(bytes32 _propertyHash) 
        public 
        validPropertyHash(_propertyHash)
        onlyFinancier(_propertyHash)
    {
        require(mortgages[_propertyHash].isActive, "Mortgage already closed");
        
        mortgages[_propertyHash].isActive = false;
        isPropertyFinanced[_propertyHash] = false;
        
        emit MortgageClosed(_propertyHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Get mortgage details for a property
     * @param _propertyHash Hashed property details
     * @return financier Address of the financier
     * @return timestamp Registration timestamp
     * @return isActive Mortgage status
     * @return amount Mortgage amount
     */
    function getMortgageDetails(bytes32 _propertyHash) 
        public 
        view 
        returns (
            address financier,
            uint256 timestamp,
            bool isActive,
            uint256 amount
        ) 
    {
        Mortgage memory mortgage = mortgages[_propertyHash];
        return (
            mortgage.financier, 
            mortgage.timestamp, 
            mortgage.isActive,
            mortgage.amount
        );
    }

    /**
     * @dev Check if a property is currently financed
     * @param _propertyHash Hashed property details
     * @return bool Property financing status
     */
    function checkPropertyStatus(bytes32 _propertyHash) 
        public 
        view 
        returns (bool) 
    {
        return isPropertyFinanced[_propertyHash];
    }

    /**
     * @dev Get all properties financed by a specific financier
     * @param _financier Address of the financier
     * @return bytes32[] Array of property hashes
     */
    function getFinancierProperties(address _financier) 
        public 
        view 
        returns (bytes32[] memory) 
    {
        return financierProperties[_financier];
    }

    /**
     * @dev Hash property details (helper function)
     * @param _propertyAddress Property address
     * @param _propertyId Property identification number
     * @return bytes32 Hashed property details
     */
    function hashPropertyDetails(
        string memory _propertyAddress, 
        uint256 _propertyId
    ) 
        public 
        pure 
        returns (bytes32) 
    {
        return keccak256(abi.encodePacked(_propertyAddress, _propertyId));
    }

    /**
     * @dev Get total number of properties financed by an address
     * @param _financier Address of the financier
     * @return uint256 Count of properties
     */
    function getFinancierPropertyCount(address _financier) 
        public 
        view 
        returns (uint256) 
    {
        return financierProperties[_financier].length;
    }
}
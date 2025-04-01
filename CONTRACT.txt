// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string name;
        address manufacturer;
        string manufacturerName;
        address owner;
        string ownerName;
        bool isRegistered;
        bool isClaimed;
        uint256 registrationTimestamp; // Unix timestamp
    }

    // Mappings for storage
    mapping(string => Product) public products;
    mapping(address => string[]) public manufacturerProducts;
    mapping(address => string[]) public ownerProducts;

    // Events
    event ProductRegistered(string productId, address manufacturer, uint256 timestamp);
    event ProductClaimed(string productId, address owner, uint256 timestamp);
    event ManufacturerNameUpdated(string productId, string newName);

    // Register product with just ID and name
    function registerProduct(
        string memory productId,
        string memory name
    ) public {
        require(!products[productId].isRegistered, "Product already registered");
        
        uint256 currentTimestamp = block.timestamp;
        
        products[productId] = Product({
            name: name,
            manufacturer: msg.sender,
            manufacturerName: "",
            owner: address(0),
            ownerName: "",
            isRegistered: true,
            isClaimed: false,
            registrationTimestamp: currentTimestamp
        });

        manufacturerProducts[msg.sender].push(productId);
        emit ProductRegistered(productId, msg.sender, currentTimestamp);
    }

    // Claim product by new owner
    function claimProduct(
        string memory productId,
        string memory ownerName
    ) public {
        require(products[productId].isRegistered, "Product not registered");
        Product storage product = products[productId];
        
        uint256 currentTimestamp = block.timestamp;
        
        if (product.isClaimed) {
            require(product.owner == msg.sender, "Already claimed by another owner");
        } else {
            product.owner = msg.sender;
            product.ownerName = ownerName;
            product.isClaimed = true;
            ownerProducts[msg.sender].push(productId);
            emit ProductClaimed(productId, msg.sender, currentTimestamp);
        }
    }

    // Set manufacturer name (added as requested)
    function setManufacturerName(
        string memory productId,
        string memory manufacturerName
    ) public {
        require(products[productId].isRegistered, "Product not registered");
        require(products[productId].manufacturer == msg.sender, "Only manufacturer can set name");
        require(bytes(manufacturerName).length > 0, "Name cannot be empty");
        
        products[productId].manufacturerName = manufacturerName;
        emit ManufacturerNameUpdated(productId, manufacturerName);
    }

    // Get registration date (YYYY-MM-DD format)
    function getRegistrationDate(string memory productId) public view returns (string memory) {
        require(products[productId].isRegistered, "Product not registered");
        return timestampToDate(products[productId].registrationTimestamp);
    }

    // Get raw timestamp
    function getRegistrationTimestamp(string memory productId) public view returns (uint256) {
        require(products[productId].isRegistered, "Product not registered");
        return products[productId].registrationTimestamp;
    }

    // Helper: Timestamp to date string (simplified)
    function timestampToDate(uint256 timestamp) internal pure returns (string memory) {
        (uint year, uint month, uint day) = daysToDate(timestamp / 86400);
        return string(abi.encodePacked(
            uint2str(year), "-",
            month < 10 ? "0" : "", uint2str(month), "-",
            day < 10 ? "0" : "", uint2str(day)
        ));
    }

    // Helper: Days since epoch to date
    function daysToDate(uint _days) internal pure returns (uint year, uint month, uint day) {
        int __days = int(_days);
        
        int L = __days + 68569 + 2440588; // 2440588 = days from 1970 to 0000
        int N = 4 * L / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = 4000 * (L + 1) / 1461001;
        L = L - 1461 * _year / 4 + 31;
        int _month = 80 * L / 2447;
        int _day = L - 2447 * _month / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;
        
        year = uint(_year);
        month = uint(_month);
        day = uint(_day);
    }

    // Helper: Uint to string
    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint j = _i;
        uint length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // View functions
    function getManufacturerProducts(address manufacturer) public view returns (string[] memory) {
        return manufacturerProducts[manufacturer];
    }

    function getOwnerProducts(address owner) public view returns (string[] memory) {
        return ownerProducts[owner];
    }
}
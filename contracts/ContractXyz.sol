// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ContractXyz is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public TKN1;
    IERC20 public TKN2;

    mapping(address => uint256) private _deposits;
    mapping(address => uint256) private _withdrawalRequests;

    function initialize(address tkn1Address, address tkn2Address) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        TKN1 = IERC20(tkn1Address);
        TKN2 = IERC20(tkn2Address);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        TKN1.transferFrom(msg.sender, address(this), amount);
        _deposits[msg.sender] += amount;
    }

    function withdrawalRequest(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(_deposits[msg.sender] >= amount, "Not enough deposit");

        _deposits[msg.sender] -= amount;
        _withdrawalRequests[msg.sender] += amount;
    }

    function claim() external {
        uint256 amount = _withdrawalRequests[msg.sender];
        require(amount > 0, "No pending withdrawal requests");

        _withdrawalRequests[msg.sender] = 0;
        TKN2.transfer(msg.sender, amount);
    }

    function fundContract(uint256 amount) external onlyOwner {
        TKN2.transferFrom(msg.sender, address(this), amount);
    }

    function getDeposit(address account) external view returns (uint256) {
        return _deposits[account];
    }

    function getWithdrawalRequest(address account) external view returns (uint256) {
        return _withdrawalRequests[account];
    }
}

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('InactivityContract.json', function(data) {
      var InactivityContractArtifact = data;
      App.contracts.InactivityContract = TruffleContract(InactivityContractArtifact);
      App.contracts.InactivityContract.setProvider(App.web3Provider);
      return App.displayNbActiveUsers();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-search', App.search);
    $(document).on('click', '.btn-register', App.register);
    $(document).on('click', '.btn-update', App.update);
  },

  displayNbActiveUsers: function() {
    var inactivityContractInstance;

    App.contracts.InactivityContract.deployed().then(function(instance) {
      inactivityContractInstance = instance;
      return inactivityContractInstance.nbActiveUsers.call();
    }).then(function(nbActiveUsers) {
      $('#nbActiveUsers').text(nbActiveUsers.toString());
    }).catch(function(err) {
      console.log(err.message);
    });

    return App.displayContractBalance();
  },

  displayContractBalance() {
    App.contracts.InactivityContract.deployed().then(function(instance) {
      inactivityContractInstance = instance;
      return inactivityContractInstance.getContractBalance.call();
    }).then(function(balance) {
      console.log(123, balance);
      $('#contract-balance').text(parseInt(balance.toString()) / Math.pow(10, 18));
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  search: function(event) {
    var userId = $('#fbIdInput').val();

    App.contracts.InactivityContract.deployed().then(function(instance) {
      inactivityContractInstance = instance;
      return inactivityContractInstance.getFbUser.call(userId);
    }).then(function(userInfo) {
      if (userInfo[0]) {
        $('.user-exists').text("Yes");
        $('.user-balance').text(parseInt(userInfo[1].toString()) / Math.pow(10, 18));
        $('.user-endat').text((new Date(parseInt(userInfo[2].toString())*1000)).toISOString());
        $('.user-latest').text((new Date(parseInt(userInfo[3].toString()))).toISOString());
        $('.user-active').text(userInfo[4].toString());
      } else {
        $('.user-exists').text("No");
        $('.user-balance .user-endat .user-latest .user-active').text("n/a");
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  register: function(event) {
    var userId = $('#fbIdInput').val();
    var encryptedAccessKey = App.encryptAccessToken($('#fbTokenInput').val());

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.InactivityContract.deployed().then(function(instance) {
        inactivityContractInstance = instance;

        // Execute adopt as a transaction by sending account
        return inactivityContractInstance.registerUser(
          userId,
          encryptedAccessKey,
          {
            from: account,
            value: 100000000000000000
          }
        );
      }).then(function(result) {
        return App.search(clientId);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  update: function(event) {
    var userId = $('#fbIdInput').val();
    var encryptedAccessKey = App.encryptAccessToken($('#fbTokenInput').val());

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.InactivityContract.deployed().then(function(instance) {
        inactivityContractInstance = instance;

        // Execute adopt as a transaction by sending account
        return inactivityContractInstance.updateUser(
          userId,
          encryptedAccessKey,
          {
            from: account,
            value: 0
          }
        );
      }).then(function(result) {
        return App.search(clientId);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  encryptAccessToken: function(accessToken) {
    return CryptoJS.AES.encrypt(accessToken, "someaeskey").toString()
    // Damn you Lambda. It keeps responding with a 502 so we will encrypt locally for now...
    // Worthless I know.
    // $.ajax({
    //   url: 'https://s72w586z15.execute-api.us-east-1.amazonaws.com/default/fbTokenEncryptor',
    //   type: 'post',
    //   data: {
    //       access_token: '10209760979113588'
    //   },
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   dataType: 'json',
    //   success: function (data) {
    //     console.info(data);
    //   }
    // });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

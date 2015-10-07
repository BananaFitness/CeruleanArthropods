var app = angular.module('eir.factory', []);

app.service('fileUpload', function($http) {
  return {
    uploadFileToUrl:function(fields, uploadUrl) {
      uploadUrl = uploadUrl || 'classes/patients';
      var fd = new FormData();
      
      // append each field to the FormData object
      for(var field in fields) {
        fd.append(field, fields[field]);
      }
      
      return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });

    }
  }
});

app.factory('profileFactory', function ($http) {

  // GET req; 
  var getProfileInfo = function() {
    //Actual function. Hard coding returned user data for testing purposes
    // return $http.get('/me')
    //   .then(function(res) {
    //     return res.data;
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
    //Hard coded user data
    return {
      firstName: 'Laura', 
      lastName: 'Weaver', 
      age: 25, 
      location: 'San Francisco, CA',
      photo: '../photos/testProfilePhoto.jpg',
      username: 'lauraweaver', 
      donations: [
        {name: 'AIDS', amount: 100, image: '../photos/no-photo.png'}, 
        {name: 'Cancer', amount: 100, image: '../photos/no-photo.png'}, 
        {name: 'Heart transplant', amount: 100, image: '../photos/no-photo.png'}, 
        {name: 'Malaria', amount: 100, image: '../photos/no-photo.png'}, 
        {name: 'Famine', amount: 100, image: '../photos/no-photo.png'}
      ]
    }
  };

  return {
    getProfileInfo: getProfileInfo
  }

});

// this factory will hold all VERB requests relating to patients
app.factory('patientsFactory', function ($http) {

  // POST req; this allows patients to enter themselves on our website
  var submitPatientForm = function(newPatient) {
    return $http.post('/classes/patients/', newPatient)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  // GET req; this will retrieve all our patients from our db
  var getPatients = function() {
    return $http.get('/classes/patients')
      .then(function(res) {
        return res.data
      })
      .catch(function(err) {
        console.log('ERROR getPatients: ' + err);
      });
  };

  // GET req; this will retrieve one specific patient from our db
  var getPatient = function(id) {
    return $http.get('/classes/patients/' + id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log('ERROR getPatient: ' + err);
      });

  };

  return {
    submitPatientForm: submitPatientForm,
    getPatient: getPatient,
    getPatients: getPatients
  }

});



app.factory('donorsFactory', function ($http) {

  //POST req; this will send the Stripe response object to the server
  var submitStripe = function (stripeObj) {
    return $http.post('/classes/stripe/', stripeObj)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log('ERROR donorsFactory.submitDonationForm: ' + err);
      });
  };

  // POST req; this will allow donors to make their donation
  var submitDonationForm = function (newDonation) {
    return $http.post('/classes/donations', newDonation)
      .then(function(res) {
        console.log(newDonation)
        console.log(res)
        return res.data;
      })
      .catch(function(err) {
        console.log(newDonation)
        console.log('ERROR donorsFactory.submitDonationForm: ' + err);
      });
  };

  // PUT req; this will update the patients financial/donation progress
  var updatePatientProgress = function (donationAmount) {
    return $http.put('/classes/patients/' + id, donationAmount)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log('ERROR updatePatientProgress: ' + err);
      });
  };

  // GET req; this will retrieve all the donors from our db
  var getDonors = function() {
    return $http.get('/classes/donors')
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log('ERROR getDonors: ' + err);
      });
  };

  // GET req; this will retrieve one specific donor from our db
  var getDonor = function(id) {
    return $http.get('/classes/donors/' + id)
      .then(function(res) {
        return res.data
      })
      .catch(function(err) {
        console.log('ERROR submitStripe: ' + err);
      });
  };

  return {
    submitDonationForm: submitDonationForm,
    updatePatientProgress: updatePatientProgress,
    getDonors: getDonors,
    getDonor: getDonor,
    submitStripe: submitStripe
  }

});

app.factory('conditionFactory', function ($http) {

  // GET req; this will retrieve one specific condition from our db
  var getCondition = function(id) {
    return $http.get('classes/conditions/' + id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log('ERROR getCondition: ' + err);
      });
  };

  // GET req; this will retrieve all the conditions from our db
  var getConditions = function() {
    return $http.get('classes/conditions')
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.log('ERROR getCondition: ' + err);
      });
  };
  
  return {
    getCondition: getCondition
  }
});

app.factory('authFactory', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/classes/users/signin',
      data: user
    })
    .then(function (res) {
      return res.data.token;
    });
  };

  var signup = function (user) {
    console.log('beep boop');
    return $http({
      method: 'POST',
      url: '/classes/users/signup',
      data: user
    })
    .then(function (res) {
      return res.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.eir');
  }

  var signout = function () {
    $window.localStorage.removeItem('com.eir');
    $location.path('/signin');
  }

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  }
});

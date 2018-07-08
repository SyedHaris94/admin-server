var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var usersList = [];

setTimeout(()=>{
//  listAllUsers();
},2500)


function listAllUsers(nextPageToken) {
  admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        usersList.push(userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        listAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
}

router.get('/get-users', function(req, res, next) {
  res.json({"status": "ok", "data" : usersList});
});

router.post('/delete-user', function(req, res, next) {
  admin.auth().deleteUser(req.body.uid)
  .then(function() {
    var refDriver = admin.database().ref("Driver/" + req.body.uid);
    var refUser = admin.database().ref("Organization/" + req.body.uid);
    var refOrganization = admin.database().ref("users/" + req.body.uid);
    refDriver.remove()
      .then(function() {
        refUser.remove()
        .then(function() {
          refOrganization.remove()
          .then(function() {
            res.json({"status": "ok", "data" : "Successfully deleted user"});
          })
          .catch(function(error) {
            res.json({"status": "error", "data" : error});
          });
        })
        .catch(function(error) {
          res.json({"status": "error", "data" : error});
        });
      })
      .catch(function(error) {
        res.json({"status": "error", "data" : error});
      });
  })
  .catch(function(error) {
    res.json({"status": "error", "data" : error});
  });
});

router.post('/update-driver', function(req, res, next) {
  admin.database().ref("Driver/" + req.body.uid).update({
    contactNum: req.body.contactNum,
    email: req.body.email,
    name: req.body.name,
    organizationName: req.body.organizationName,
    role: req.body.role
  }, function(error) {
      if (error) {
        res.json({"status": "error", "data" : error});
      } else {
        res.json({"status": "ok", "data" : ""});
      }
    }
  );
  admin.auth().updateUser(req.body.uid, {
    email: req.body.email,
    contactNum: req.body.contactNum,
    emailVerified: true,
    role: req.body.role,
    displayName: req.body.name,
    // password: req.body.password,
    // uid: req.body.uid,
    // photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch(function(error) {
      console.log("Error updating user:", error);
    });
});

router.post('/update-organization', function(req, res, next) {
  admin.database().ref("Organization/" + req.body.uid).update({
    approved: req.body.approved,
    contactNum: req.body.contactNum,
    email: req.body.email,
    name: req.body.name,
    role: req.body.role
  }, function(error) {
      if (error) {
        res.json({"status": "error", "data" : error});
      } else {
        res.json({"status": "ok", "data" : ""});
      }
    }
  );
  admin.auth().updateUser(req.body.uid, {
    email: req.body.email,
    contactNum: req.body.contactNum,
    emailVerified: true,
    role: req.body.role,
    displayName: req.body.name,
    // password: req.body.password,
    // uid: req.body.uid,
    // photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch(function(error) {
      console.log("Error updating user:", error);
    });
});

router.post('/update-users', function(req, res, next) {
  admin.database().ref("users/" + req.body.uid).update({
    contactNum: req.body.contactNum,
    email: req.body.email,
    name: req.body.name
  }, function(error) {
      if (error) {
        res.json({"status": "error", "data" : error});
      } else {
        res.json({"status": "ok", "data" : ""});
      }
    }
  );
  admin.auth().updateUser(req.body.uid, {
    email: req.body.email,
    contactNum: req.body.contactNum,
    emailVerified: true,
    role: req.body.role,
    displayName: req.body.name,
    // password: req.body.password,
    // uid: req.body.uid,
    // photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch(function(error) {
      console.log("Error updating user:", error);
    });

});


module.exports = router;

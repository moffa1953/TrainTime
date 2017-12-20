     // firebase

      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyAtw4WZCgoVIoD4W958oXopGXe74OiA66w",
        authDomain: "trainschedule-2b458.firebaseapp.com",
        databaseURL: "https://trainschedule-2b458.firebaseio.com",
        projectId: "trainschedule-2b458",
        storageBucket: "",
        messagingSenderId: "349727806623"
      };
      firebase.initializeApp(config);


  
     var database = firebase.database();

     // Initial Values
     var name = "";
     var dest = "";
     var firstTrain = 0;
     var trainInv = 0;
     var minutesAway = 0;
     var nextTrain = "";

     trainHeadingdisplay()

     // Capture Button Click
     $("#add-user").on("click", function(event) {
         event.preventDefault();
         name = $("#name-input").val().trim();
         dest = $("#dest-input").val().trim();
         firstTrain = $("#firstTrain-input").val().trim();
         trainInv = $("#TrainInv-input").val().trim();

         database.ref().push({
              name: name,
              dest: dest,
              firstTrain: firstTrain,
              trainInv: trainInv,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
         });
         $("#formID").trigger("reset");
     });

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
     database.ref().on("child_added", function(childSnapshot) {
            nextTrain = "";

            // Store everything into a variable.
            var name = childSnapshot.val().name;
            var dest = childSnapshot.val().dest;
            var firstTrain = childSnapshot.val().firstTrain;
            var trainInv = childSnapshot.val().trainInv;

            getTime(trainInv,firstTrain)


            $("#full-train-sched").append("<tr>" +
                    "<td width='250px'>"+name+"</td>" +
                    "<td width='250px'>"+dest+"</td>" +
                    "<td width='125px'>"+firstTrain+"</td>" +
                    "<td width='125px'>"+trainInv+"</td>" +
                    "<td width='125px'>"+nextTrain+"</td>" +
                    "<td width='125px'>"+minutesAway+"</td>" +
                    "</tr></table"
            )

            $("#full-train-sched").append("</table>")

     }, function(errorObject) {
           console.log("Errors handled: " + errorObject.code);
     });

     // the following will calculate the time of the next train
     function  getTime(tFrequency,firstTime) {
          
          // the next line will handle schedules that go past midnight
          var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
          

          var currentTime = moment();

          // check if first train will start in the future
          if(moment(firstTime,'hh:mm') > currentTime) {
            nextTrain = firstTime;
            minutesAway = moment(firstTime,'hh:mm').diff(moment(currentTime), "minutes");
          } else {
            // number amount of minutes from the sgtart of the first train to the current time
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

            // the folowing will give us a remainder which will be used to calculate the next train
            var tRemainder = diffTime % tFrequency;
            minutesAway = tFrequency - tRemainder;
            nextTrain = moment().add(minutesAway, "minutes");
            nextTrain = moment(nextTrain).format("HH:mm");
          }
          
     }


     // train schedule display panel heading
     function trainHeadingdisplay() {

         $("#full-train-sched").append("<table><tr class='displayBold'>" +
                  "<td width='250px'>Name</td>" +
                  "<td width='250px'>Destination</td>" +
                  "<td width='125px'>First Train</td>" +
                  "<td width='125px'>Train Interval</td>" +
                  "<td width='125px'>Next Train</td>" +
                  "<td width='125px'>Waiting Time</td>" +
            "</tr>")

     }

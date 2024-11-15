 $(document).ready(() => {
refreshPersonnelTable();
refreshDepartmentsTable();
refreshLocationsTable();


$("#searchInp").on("keyup",function (){
  var searchText = $(this).val();

  $.ajax({
    url: "libs/php/searchAll.php",
    type:"POST",
    dataType:"json",
    data: { txt: searchText},
    success: function (result){
      var resultCode = result.status.code;

      if(resultCode == 200){
        if($("#personnelBtn").hasClass("active")){
          refreshPersonnelTable(result.data.found);
        }else if ($("#departmentsBtn").hasClass("active")) {
          refreshDepartmentsTable(result.data.found);
        }else if ($("#locationsBtn").hasClass("active")) {
          refreshLocationsTable(result.data.found)
        }
      }
    }
  })
})
 })

   //Handle refresh button
   $("#refreshBtn").click(function(){
    if($("#personnelBtn").hasClass("active")){
      refreshPersonnelTable();
    }else if ($("#departmentsBtn").hasClass("active")){
      refreshDepartmentsTable();
    }else if ($("#locationsBtn").hasClass("active")){
      refreshLocationsTable();
    }
  })
  
  //Handle filter button
  $("#filterBtn").click(function(){
    if($("#personnelBtn").hasClass("active")){
     refreshPersonnelTable();
    }else if ($("#departmentsBtn").hasClass("active")){
      refreshDepartmentsTable();
    }else if ($("#locationsBtn").hasClass("active")){
      refreshLocationsTable();
    }
  })
  
  //Handle add button
  $("#addBtn").click(function(){
    if($("#personnelBtn").hasClass("active")){
     refreshPersonnelTable();
    }else if ($("#departmentsBtn").hasClass("active")){
      refreshDepartmentsTable();
    }else if ($("#locationsBtn").hasClass("active")){
      refreshLocationsTable();
    }
  })
  
  
  //Refresh personnel Table
  function refreshPersonnelTable() {
    $.ajax({
      url: "libs/php/getAll.php", 
      type: "GET",
      dataType: "json",
      success: function(result) {
        console.log(result); 
  
        var resultCode = result.status.code; 
    
        if (resultCode == 200 && result.data && result.data.length > 0) {
          var personnelTableBody = $("#personnelTableBody");
          personnelTableBody.empty();
    
          $.each(result.data, function() {
            var row = `
              <tr>
                <td>${this.firstName} ${this.lastName}</td>
                <td>${this.department}</td>
                 <td>${this.location}</td>
                <td>${this.email}</td>
                <td>
                  <button class="btn btn-primary" data-id=1 data-bs-toggle="modal" data-bs-target="#editPersonnelModal"><i class="fa-solid fa-pencil"></i></button>
                  <button class="btn btn-primary delete-btn" data-id="${this.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>`;
            personnelTableBody.append(row);
          });
        } else {
          alert("Error loading personnel data.");
        }
      },
      error: function(xhr, status, error) {
        console.error("Error details:", status, error);
        alert("An error occurred while fetching personnel data.");
      }
    });
  }
  
  $(document).on("click", ".delete-btn", function() {
    var personnelId = $(this).data("id");
  
    if (confirm("Are you sure you want to remove this record?")) {
      $.ajax({
        url: "libs/php/deletePersonnelByID.php", 
        type: "POST", 
        data: { id: personnelId },
        dataType: "json",
        success: function(result) {
          console.log(result); 
  
          if (result.status.code == 200) {
            alert("Record deleted successfully!");
          
            refreshPersonnelTable(); 
          } else {
            alert("Error deleting record: " + result.status.description);
          }
        },
        error: function(xhr, status, error) {
          console.error("Error details:", status, error);
          alert("An error occurred while deleting the record.");
        }
      });
    }
  });

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    var personnelId = $(e.relatedTarget).attr("data-id");
    console.log("Personnel ID sent to PHP:", personnelId);
  
   
    if (personnelId) {
      $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: { id: personnelId },
        success: function (result) {
          var resultCode = result.status.code;
  
          if (resultCode == 200) {
            var personnel = result.data.personnel[0];
            
            $("#editPersonnelEmployeeID").val(personnel.id);
            $("#editPersonnelFirstName").val(personnel.firstName);
            $("#editPersonnelLastName").val(personnel.lastName);
            $("#editPersonnelJobTitle").val(personnel.jobTitle);
            $("#editPersonnelEmailAddress").val(personnel.email);
  
         
            $("#editPersonnelDepartment").empty();
            $.each(result.data.department, function () {
              $("#editPersonnelDepartment").append(
                $("<option>", { value: this.id, text: this.name })
              );
            });
  
          
            $("#editPersonnelDepartment").val(personnel.departmentID);
            
          } else {
            console.error("Error retrieving data: " + result.status.description);
            $("#editPersonnelModal .modal-title").text("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("AJAX request failed with status: " + textStatus);
          console.error("Error details: " + errorThrown);
          $("#editPersonnelModal .modal-title").text("Error retrieving data");
        }
      });
    } else {
      console.error("No personnel ID found when trying to open the modal.");
    }
  });
  

  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();  // Prevent the default form submission behavior
  
    var formData = {
      id: $("#editPersonnelEmployeeID").val(), 
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      departmentID: $("#editPersonnelDepartment").val()
    };
  
    console.log("ID:", $("#editPersonnelEmployeeID").val());
    console.log("First Name:", $("#editPersonnelFirstName").val());
    console.log("Last Name:", $("#editPersonnelLastName").val());
    console.log("Job Title:", $("#editPersonnelJobTitle").val());
    console.log("Email:", $("#editPersonnelEmailAddress").val());
    console.log("Department ID:", $("#editPersonnelDepartment").val());
    
  
    $.ajax({
      url: "libs/php/updatePersonnel.php", 
      type: "POST",
      dataType: "json",
      data: formData,
      success: function(response) {
        if (response.status.code == "200") {
          alert("Personnel updated successfully!");
          $("#editPersonnelModal").modal("hide"); 
          refreshPersonnelTable(); 
        } else {
          alert("Error: " + response.status.description);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error in AJAX request:", textStatus, errorThrown);
        alert("An error occurred while updating personnel.");
      }
    });
  });
    
   
  
  // Refresh department table
  function refreshDepartmentsTable() {
    $.ajax({
      url: "libs/php/getAllDepartments.php", 
      type: "GET",
      dataType: "json",
      success: function(result) {
        console.log(result); 
  
        var resultCode = result.status.code; 
    
        if (resultCode == 200 && result.data && result.data.length > 0) {
          var departmentTableBody = $("#departmentTableBody");
          departmentTableBody.empty();
    
          $.each(result.data, function() {
            var row = `
              <tr>
                <td>${this.name}</td>
                 <td>${this.location}</td>
                <td>
                  <button class="btn btn-primary" data-id="${this.id}" ><i class="fa-solid fa-pencil"></i></button>
                  <button class="btn btn-primary delete-department-btn" data-id="${this.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>`;
            departmentTableBody.append(row);
          });
        } else {
          alert("Error loading department data.");
        }
      },
      error: function(xhr, status, error) {
        console.error("Error details:", status, error);
        alert("An error occurred while fetching department data.");
      }
    });
  }


  
  //delete department
  $(document).on("click", ".delete-department-btn", function() {
    var departmentId = $(this).data("id");
  
    if (confirm("Are you sure you want to delete this department?")) {
      $.ajax({
        url: "libs/php/deleteDepartmentByID.php", 
        type: "POST",
        dataType: "json",
        data: { id: departmentId },
        success: function(result) {
          if (result.status.code == 200) {
            alert("Department deleted successfully!");
            refreshDepartmentsTable(); 
          } else {
            alert("Error deleting department: " + result.status.description);
          }
        },
        error: function(xhr, status, error) {
          console.error("Error deleting department:", error);
          alert("An error occurred while deleting the department.");
        }
      });
    }
  });
  

  
  // Refresh location table
  function refreshLocationsTable() {
    $.ajax({
      url: "libs/php/getAllLocations.php", 
      type: "GET",
      dataType: "json",
      success: function(result) {
        console.log(result); 
  
        var resultCode = result.status.code; 
    
        if (resultCode == 200 && result.data && result.data.length > 0) {
          var locationTableBody = $("#locationTableBody");
          locationTableBody.empty();
    
          $.each(result.data, function() {
            var row = `
              <tr>
                <td>${this.name}</td>
                <td>
                  <button class="btn btn-primary" data-id="${this.id}"><i class="fa-solid fa-pencil"></i></button>
                  <button class="btn btn-primary delete-location-btn" data-id="${this.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>`;
            locationTableBody.append(row);
          });
        } else {
          alert("Error loading location data.");
        }
      },
      error: function(xhr, status, error) {
        console.error("Error details:", status, error);
        alert("An error occurred while fetching location data.");
      }
    });
  }
  // Delete location button functionality
$(document).on("click", ".delete-location-btn", function() {
  var locationId = $(this).data("id");

  if (confirm("Are you sure you want to delete this location?")) {
    $.ajax({
      url: "libs/php/deleteLocationByID.php", 
      type: "POST",
      dataType: "json",
      data: { id: locationId },
      success: function(result) {
        console.log(result);

        if (result.status.code == 200) {
          alert("Location deleted successfully!");
          refreshLocationsTable(); 
        } else {
          alert("Error deleting location: " + result.status.description);
        }
      },
      error: function(xhr, status, error) {
        console.error("Error details:", status, error);
        alert("An error occurred while deleting the location.");
      }
    });
  }
});


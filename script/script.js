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
                <td>${this.email}</td>
                <td>
                  <button class="btn btn-primary" data-id="${this.id}" data-bs-toggle="modal" data-bs-target="#editPersonnelModal"><i class="fa-solid fa-pencil"></i></button>
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
        url: "libs/php/deleteDepartmentByID.php", 
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

  // Fetch personnel data and populate the edit modal
function openEditPersonnelModal(personnelId) {
   
  $.ajax({
    url: 'libs/php/getPersonnelByID.php', 
    type: 'GET',
    data: { id: personnelId },
    success: function(response) {
      if (response.status.code === "200") {
        let personnel = response.data;

        populateDepartmentDropdown(personnel.departmentID);
        $("#editPersonnelEmployeeID").val(personnel.id);
        $("#editPersonnelFirstName").val(personnel.firstName);
        $("#editPersonnelLastName").val(personnel.lastName);
        $("#editPersonnelJobTitle").val(personnel.jobTitle);
        $("#editPersonnelEmailAddress").val(personnel.email);
     
        $("#editPersonnelModal").modal("show");
      } else {
        alert("Failed to fetch personnel data.");
      }
    },
    error: function() {
      alert("An error occurred while fetching personnel data.");
    }
  });
}

  // Function to populate department dropdown dynamically
  function populateDepartmentDropdown(selectedDepartmentId) {
    $.ajax({
      url: 'libs/php/getAllDepartments.php', 
      type: 'GET',
      success: function(response) {
        if (response.status.code === "200") {
          let departments = response.data;
          let departmentSelect = $("#editPersonnelDepartment");
          departmentSelect.empty(); 
  
          departments.forEach(function(department) {
            let option = $("<option>", {
              value: department.id,
              text: department.name,
              selected: department.id === selectedDepartmentId
            });
            departmentSelect.append(option);
          });
        } else {
          alert("Failed to fetch departments.");
        }
      },
      error: function() {
        alert("An error occurred while fetching department data.");
      }
    });
  }
  
  //Handle the submission form
  $("#editPersonnelForm").on("submit", function(e){
    e.preventDefault();
  
    var formData = $(this).serialize();
    console.log("Form data being sent: ", formData);

    $.ajax({
      url: "libs/php/updatePersonnel.php",
      type:"POST",
      data: formData,
      success: function(response){
        var resultCode = response.status.code;
  
        if(resultCode == 200){
          $("#editPersonnelModal").modal("hide");
          refreshPersonnelTable();
        }else{
          alert("error updating perssonel");
        }
      },
      error:function(){
        alert("error updating personnel")
      }
  
    })
  })
  
   
  
  // Refresh department table
  function refreshDepartmentsTable() {
    $.ajax({
      url: "libs/php/getAllDepartments.php", 
      type: "GET",
      dataType: "json",
      success: function(result) {
        console.log(result); // Log the result to check the returned data
  
        var resultCode = result.status.code; // Check the status code
    
        if (resultCode == 200 && result.data && result.data.length > 0) {
          var departmentTableBody = $("#departmentTableBody");
          departmentTableBody.empty();
    
          $.each(result.data, function() {
            var row = `
              <tr>
                <td>${this.name}</td>
                <td>
                  <button class="btn btn-primary" data-id="${this.id}"><i class="fa-solid fa-pencil"></i></button>
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
  

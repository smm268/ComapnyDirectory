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
        if($("#perssonelBtn").hasClass("active")){
          refreshPersonnelTable(result.data.found);
        }else if ($("#deparmentsBtn").hasClass("active")) {
          refreshDepartmentsTable(result.data.found);
        }else if ($("#locationsBtn").hasClass("active")) {
          refreshLocationsTable(result.data.found)
        }
      }
    }
  })
})

//Handle refresh button
$("#refreshBtn").click(function(){
  if($("#perssonelBtn").hasClass("active")){
    refreshPersonnelTable();
  }else if ($("#deparmentsBtn").hasClass("active")){
    refreshDepartmentsTable();
  }else if ($("#locationsBtn").hasClass("active")){
    refreshLocationsTable();
  }
})

//Handle filter button
$("#filterBtn").click(function(){
  if($("#personnelBtn").hasClass("active")){
    openPersonnelModal();
  }else if ($("#departmentsBtn").hasCLass("active")){
    openDepartmentModal();
  }else if ($("#locationsBtn").hasCLass("active")){
    openLocationModal();
  }
})


//handle tabs
$("#personnelBtn").click(function(){
  refreshPersonnelTable();
})

$("#departmentsBtn").click(function(){
  refreshDepartmentsTable();
})

$("#locationsBtn").click(function(){
  refreshLocationsTable();
})

//editing perssonel
$("#editPersonnelModal").on("show.bs.modal", function(e){
  var personnelID= $(e.relatedTarget).attr("data-id");

  $.ajax({
    url:"libs/php/getPersonnelByID.php",
    type:"POST",
    dataType:"json",
    data:{ id: personnelID},
    success:function (result) {
      var resultCode = result.status.code;

      if(resultCode == 200){
        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
       //populate department dropdown
        $("#editPersonnelDepartment").html("");
        $.each(result.data.department, function(){
          $("#editPersonnelDepartment").append(
            $("<option>",{
              value: this.id,
              text: this.name
            })
          )
        })
         //set selected department
         $("#editPerssonelDepartment").val(result.data.perssonel[0].departmentID);
      }else{
        alert("Error retrieving data")
      }
    },
    error:function (jqXHR, testStatus, errorThrow){
      alert("error retieving data");
    }
  })
})


//Handle the submission form
$("#editPersonnelForm").on("submit", function(e){
  e.perventDefault();

  var formData = $(this).serialize();

  $.ajax({
    url: "libs/php/updatePersonnel.php",
    type:"POST",
    data: "formData",
    success: function(reponse){
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

//Refresh personnel Table
function refreshPersonnelTable(data) {
  $.ajax({
    url: "libs/php/getAllPersonnel.php", 
    type: "GET",
    dataType: "json",
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        var personnelTableBody = $("#personnelTableBody");
        personnelTableBody.empty();

        $.each(result.data, function () {
          var row = `<tr>
            <td>${this.firstName} ${this.lastName}</td>
            <td>${this.jobTitle}</td>
            <td>${this.email}</td>
            <td>${this.departmentName}</td>
            <td>${this.locationName}</td>
            <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${this.id}">Edit</button></td>
          </tr>`;
          personnelTableBody.append(row);
        });
      } else {
        alert("Error loading personnel data.");
      }
    }
  });
}

// Refresh department table
function refreshDepartmentsTable() {
  $.ajax({
    url: "libs/php/getAllDepartments.php", 
    type: "GET",
    dataType: "json",
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        var departmentTableBody = $("#departmentTableBody");
        departmentTableBody.empty();

        $.each(result.data, function () {
          var row = `<tr>
            <td>${this.name}</td>
            <td><button class="btn btn-warning">Edit</button></td>
          </tr>`;
          departmentTableBody.append(row);
        });
      } else {
        alert("Error loading department data.");
      }
    }
  });
}

// Refresh location table
function refreshLocationsTable() {
  $.ajax({
    url: "libs/php/getAllLocations.php", 
    type: "GET",
    dataType: "json",
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        var locationTableBody = $("#locationTableBody");
        locationTableBody.empty();

        $.each(result.data, function () {
          var row = `<tr>
            <td>${this.name}</td>
            <td><button class="btn btn-warning">Edit</button></td>
          </tr>`;
          locationTableBody.append(row);
        });
      } else {
        alert("Error loading location data.");
      }
    }
  });
}

// Open add personnel modal
function openPersonnelModal() {
  $("#addPersonnelModal").modal("show");
}

// Open add department modal 
function openDepartmentModal() {
  $("#addDepartmentModal").modal("show");
}

// Open add location modal 
function openLocationModal() {
  $("#addLocationModal").modal("show");
}
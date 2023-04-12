/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
$('#rollNo').focus();
var connToken = "90932845|-31949281804406819|90948311";
var DBName = "StudentEnrollment";
var RelationName = "SEF";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var BaseUrl = "http://api.login2explore.com:5577";


function saveRecord(jsonobj) {
    var lvData = JSON.parse(jsonobj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("enrollmentDate").val("");

    $("#rollNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollNo").focus();
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, DBName, RelationName);
    $.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, BaseUrl, jpdbIML);
    $.ajaxSetup({async: true});
    resetForm();
    $("#rollNo").focus();

}

function validateData() {
    var rollNo, name, sclass, birthDate, address, enrollmentDate;
    rollNo = $("#rollNo").val();
    name = $("#fullName").val();
    sclass = $("#class").val();
    birthDate = $("#birthDate").val();
    address = $("#address").val();
    enrollmentDate = $("enrollmentDate").val();

    if (rollNo === "") {
        alert("Roll Number in Mandatory . ");
        $("#rollNo").focus();
        return "";
    }

    if (name === "") {
        alert("Name in Mandatory . ");
        $("#fullName").focus();
        return "";
    }
    if (sclass === "") {
        alert("Class in Mandatory . ");
        $("#class").focus();
        return "";
    }
    if (birthDate === "") {
        alert("Birth - Date is Mandatory . ");
        $("#birthDate").focus();
        return "";
    }
    if (address === "") {
        alert("Address in Mandatory . ");
        $("#address").focus();
        return "";
    }
    if (enrollmentDate === "") {
        alert("Enrollment Date in Mandatory . ");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonStrObj = {
        RollNo: rollNo,
        Name: name,
        Class: sclass,
        BirthDate: birthDate,
        Address: address,
        EnrollmentDate: enrollmentDate
    };

    return JSON.stringify(jsonStrObj);

}

function getStudent() {
    var empRollJsonObj = getRollAsJsonObj();

    var getByKey = createGET_BY_KEYRequest(connToken, DBName, RelationName, empRollJsonObj);
    $.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getByKey, BaseUrl, jpdbIRL);
    $.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#Save").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#rollNo").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disbale", true);
        fillData(resJsonObj);
        $("#Change").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#fullName").focus();

    }


}

function fillData(jsonObjStr) {
    saveRecord(jsonObjStr);

    var record = JSON.parse(jsonObjStr.data).record;
    console.log("this is fill data" + record.RollNo);
    $("#rollNo").val(record.RollNo);
    $("#fullName").val(record.Name);
    $("#class").val(record.Class);
    $("#birthDate").val(record.BirthDate);
    $("#address").val(record.Address);
    $("enrollmentDate").val(record.EnrollmentDate);


}

function getRollAsJsonObj() {
    var rollNo = $("#rollNo").val();
    var jsonObj = {
        RollNo: rollNo
    };
    return JSON.stringify(jsonObj);
}

function changeStudent() {
    $("#Change").prop("disabled", true);
    jsonChange = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChange, DBName, RelationName, localStorage.getItem("recno"));
    $.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, BaseUrl, jpdbIML);
    $.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollNo").focus();
}
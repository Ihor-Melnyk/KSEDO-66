function setPropertyRequired(attributeName, boolValue = true) {
  //обов"язкове
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.required = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyHidden(attributeName, boolValue = true) {
  //приховане
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.hidden = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function onCardInitialize() {
  setInitialProps();
}

function setInitialProps() {
  debugger;
  var Proceedings = EdocsApi.getAttributeValue("Proceedings").value;
  if (Proceedings) {
    switch (Proceedings) {
      case "Студент":
        setPropertyHidden("Student", false);
        setPropertyHidden("Info", false);
        setPropertyRequired("STD_NAME");
        break;

      case "Викладач":
        setPropertyHidden("Teacher", false);
        setPropertyHidden("info2", false);
        setPropertyRequired("TeacherName");
        break;

      default:
        break;
    }
  }
}

//-------------------------------
// еСайн
//-------------------------------
function setDataForESIGN() {
  debugger;
  var regDate = EdocsApi.getAttributeValue("RegDate").value;
  var regNumber = EdocsApi.getAttributeValue("RegNumber").value;
  var name =
    "№" +
    (regNumber ? regNumber : CurrentDocument.id) +
    (!regDate ? "" : " від " + moment(regDate).format("DD.MM.YYYY"));
  doc = {
    docName: name,
    extSysDocId: CurrentDocument.id,
    ExtSysDocVersion: CurrentDocument.version,
    docType: "contract", // замінити на правильний тип документу
    parties: [
      {
        taskType: "ToSign",
        taskState: "Done",
        legalEntityCode: EdocsApi.getAttributeValue("OrgEDRPOU").value,
        contactPersonEmail: EdocsApi.getEmployeeDataByEmployeeID(
          CurrentDocument.initiatorId
        ).email,
        signatures: [],
      },
      {
        taskType: "ToSign",
        taskState: "NotAssigned",
        legalEntityCode: EdocsApi.getAttributeValue("TeacherEmail2").value,
        contactPersonEmail: EdocsApi.getAttributeValue("TeacherEmail2").value,
        expectedSignatures: [],
      },
      {
        taskType: "ToSign",
        taskState: "NotAssigned",
        legalEntityCode: EdocsApi.getAttributeValue("StdEmail3").value,
        contactPersonEmail: EdocsApi.getAttributeValue("StdEmail3").value,
        expectedSignatures: [],
      },
    ],
    sendingSettings: {
      attachFiles: "fixed",
      attachSignatures: "signatureAndStamp",
    },
  };
  EdocsApi.setAttributeValue({ code: "LSDJSON", value: JSON.stringify(doc) });
}

function onTaskExecuteSendOutDoc(routeStage) {
  debugger;
  if (routeStage.executionResult != "rejected") {
    setDataForESIGN();

    var methodData = {
      extSysDocId: CurrentDocument.id,
      ExtSysDocVersion: CurrentDocument.version,
    };
    routeStage.externalAPIExecutingParams = {
      externalSystemCode: "ESIGN",
      externalSystemMethod: "integration/importDoc",
      data: methodData,
      executeAsync: true,
    };
  }
}

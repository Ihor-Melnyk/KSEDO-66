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

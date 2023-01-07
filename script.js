// function to add value to input field when button is clicked with class "btnValue"

$(document).ready(function() {
    var sign = false;
    var total = 0;
    $(".btnValue").click(function() {
        let value = $(this).val();
        let currentVal = $("#valueInput").val();
        $("#valueInput").val(currentVal + value);
        sign = false;
    });
    $("#clear").click(function() {
        $("#valueInput").val("");
    });
    $("#delete").click(function() {
        let currentVal = $("#valueInput").val();
        $("#valueInput").val(currentVal.slice(0, -1));
    });
    $(".btnSign").click(function() {
        if (sign == false && $("#valueInput").val() != "") {
            total = $("#valueInput").val();
            $("#resultT").text(total);
            sign = true;
            let signT = $(this).val();
            $("#valueInput").val(total + signT);
        }
    });
    $("#equal").click(function() {
        //split string by every sign
        let currentVal = $("#valueInput").val();
        let splitVal = currentVal.split(/(\+|\-|\*|\/)/);
        for (let i = 0; i < splitVal.length; i++) {
            if (splitVal[i] == "+") {
                total = parseFloat(splitVal[i - 1]) + parseFloat(splitVal[i + 1]);
            } else if (splitVal[i] == "-") {
                total = parseFloat(splitVal[i - 1]) - parseFloat(splitVal[i + 1]);
            } else if (splitVal[i] == "*") {
                total = parseFloat(splitVal[i - 1]) * parseFloat(splitVal[i + 1]);
            } else if (splitVal[i] == "/") {
                total = parseFloat(splitVal[i - 1]) / parseFloat(splitVal[i + 1]);
            }
        }

        $("#valueInput").val(total);
    });
});

// function to add value to input field when button is clicked with class "btnValue"

$(document).ready(function() {
    var sign = false;
    var total = 0;
    var calc = "";
    var parcel = 0;
    var cSign = "";
    $("#valueInput").val("");

    $(".btnValue").click(function() {
        let value = $(this).val();
        calc += value;
        let currentVal = $("#valueInput").val();
        parcel = currentVal + value;

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
        if (sign == false) {
            let value = $("#valueInput").val();
            if (value != "") {
                if (total == 0) {
                    total = parseFloat(calc);
                } else {
                    calculate(cSign);
                }
                calc = "";
                cSign = $(this).val();
                $("#resultT").text(total);
                sign = true;
                $("#valueInput").val(total + cSign);
            }
        } else {
            let value = $("#valueInput").val();
            let signT = $(this).val();
            $("#valueInput").val(value.slice(0, -1) + signT);
        }
    });

    $("#equal").click(function() {
        calculate(cSign)

        $("#valueInput").val(total);
    });

    function calculate(sign) {
        let acc = "";
        switch (sign) {
            case "+":
                total = total + parseInt(calc);
                acc = total + "+" +calc + "=" + total;
                break;
            case "-":
                total = total - parseInt(calc);
                acc = total + "-" +calc + "=" + total;
                break;
            case "*":
                total = total * parseInt(calc);
                acc = total + "*" +calc + "=" + total;
                break;
            case "/":
                total = total / parseInt(calc);
                acc = total + "/" +calc + "=" + total;
                break;
        }
        // Create a new <li> element
        var li = document.createElement("li");
        // Create a text node
        var text = document.createTextNode(acc);
        // Append the text to <li>
        li.appendChild(text);
        // Append <li> to <ul> with id="myList"
        document.getElementById("last-calc").appendChild(li);
        //Scroll to bottom
        var objDiv = document.getElementById("last-calc");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
});

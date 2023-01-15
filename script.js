// function to add value to input field when button is clicked with class "btnValue"

//Everything inside this statement will be executed when the page is loaded
$(document).ready(function() {
    //Last value entered is a sign
    var sign = false;
    //Current total of the calculation
    var total = 0;
    //Variable to store the string of the calculation
    var calc = "";
    //Variable to store the symbol of the calculation
    var cSign = "";
    //Variable to store if the last action was a equals sign
    var eq = false;

    //Get the history of calculations from local storage
    var lastConts = JSON.parse(localStorage.getItem("lastConts"));
    //If there is no history, create an empty array
    if (lastConts == null) {
        lastConts = [];
    } else {
        //If there is history, display it
        for (let i = 0; i < lastConts.length; i++) {
            // Create a new <li> element
            var li = document.createElement("li");
            // Create a text node
            var text = document.createTextNode(lastConts[i]);
            // Append the text to <li>
            li.appendChild(text);
            // Append <li> to <ul> with id="myList"
            document.getElementById("last-calc").appendChild(li);
        }
    }

    //Clear calculation screen on load
    $("#valueInput").val("");

    //Function to add value to input field when button is clicked with class "btnValue"
    $(".btnValue").click(function() {
        //The buttons only work if the last action was not an equals sign
        if (eq == false) {
            //Get the value of the button that was clicked
            let value = $(this).val();
            calc += value;
            //Display the value on the screen
            $("#resultT").text(total);
            let currentVal = $("#valueInput").val();
            //If total is diffrent from 0 and the sign is false, the total is displayed in the result field
            if (total != 0 && sign == false) {
                $("#resultT").text(total);
            }

            //If the total is 0, the current value is displayed in the result field
            if (total == 0) {
                $("#resultT").text(calc);
            }

            //Calculate the total based on the current sign selected
            if(cSign != ""){
               calculateT(cSign)
            }

            //Update the input field with the current value
            $("#valueInput").val(currentVal + value);
            sign = false;
        }
    });

    //Function to clear the screen and localstorage
    $("#clear").click(function() {
        sign = false;
        total = 0;
        calc = "";
        cSign = "";
        eq = false;
        $("#valueInput").val("");
        $("#resultT").text("");
        //remove all li elements
        $("#last-calc").empty();
        //clear local storage lastConts
        lastConts = [];
        localStorage.setItem("lastConts", JSON.stringify(lastConts));
    });

    //Function to delete the last character
    $("#delete").click(function() {
        //The buttons only work if the last action was not an equals sign
        if (eq == false) {
            let currentVal = $("#valueInput").val();
            //If the current value is not empty, remove the last character
            if (currentVal != "") {
                //if last character is a sign, set sign to false
                if (currentVal[currentVal.length - 1] == "+" || currentVal[currentVal.length - 1] == "-" || currentVal[currentVal.length - 1] == "*" || currentVal[currentVal.length - 1] == "/") {
                    sign = false;
                    cSign = "";
                    eq = false;
                    total = 0;
                    $("#valueInput").val(currentVal.slice(0, -1));
                    calc = $("#valueInput").val();
                    $("#resultT").text(calc);
                }  else {
                    //if last character is not a sign, remove last character
                    calc = calc.slice(0, -1);
                    $("#valueInput").val(currentVal.slice(0, -1));
                    $("#resultT").text(calc);
                }
            }
        }
    });

    //Function to add a sign to the calculation
    $(".btnSign").click(function() {
        //If the last action was not a sign
        if (sign == false) {
            let value = $("#valueInput").val();
            //If the value is not empty
            if (value != "") {
                //If total is 0, set total to the current value
                if (total == 0) {
                    total = parseFloat(calc);
                } else {
                    //If the equals sign was not pressed, calculate the total
                    if (eq == false) {
                        calculate(cSign);
                    }
                }
                //Clear the calc variable for the next part of the calculation
                calc = "";
                //Get the current sign
                cSign = $(this).val();
                //Display the total in the result field
                $("#resultT").text(total);
                //Update the state of sign to true
                sign = true;
                //Update the input field with the current value
                $("#valueInput").val(total + cSign);
            }
            //If the last action was a sign, update the sign
        } else {
            let value = $("#valueInput").val();
            let signT = $(this).val();
            //Remove the last sign and add the new sign
            $("#valueInput").val(value.slice(0, -1) + signT);
        }
        eq = false;
    });

    //Function to calculate the total
    $("#equal").click(function() {
        //If the last action was not a sign, the calc is not empty and the current sign is not empty
        if (sign == false && calc != "" && cSign != "") {
            calculate(cSign);
            $("#valueInput").val(total);
            //Update the state of eq to true
            eq = true;
        }
    });

    //Function to add a floating point to the calculation
    $("#btnPoint").click(function() {
        //If the equals sign was not pressed
        if (eq == false) {
            let value = $("#valueInput").val();
            //If the value is not empty
            if (value != "") {
               //detect if calc already has a point, if not add a point
                if (calc.indexOf(".") == -1) {
                    calc += ".";
                    $("#valueInput").val(value + ".");
                }
            }
        }
    });

    //Function to change value to negative or positive
    $("#valSign").click(function() {
        //If the equals sign was not pressed
        if (eq == false) {
            let value = $("#valueInput").val();
            //If the value does not start with a minus sign, add a minus sign
                if (calc.indexOf("-") == -1) {
                    //if value last character is a sign
                    if (value.slice(-1) == "+" || value.slice(-1) == "-" || value.slice(-1) == "*" || value.slice(-1) == "/") {
                        $("#valueInput").val(value + "-");
                    } else {
                        $("#valueInput").val("-" + value);
                    }
                    calc = "-" + calc;
                    //If the value starts with a minus sign, remove the minus sign
                } else {
                    calc = calc.slice(1);
                    $("#valueInput").val(value.slice(1));
                }
            }
    });

    //Function to calculate the percentage of the current value
    $("#btnPercent").click(function() {
        //If the equals sign was not pressed
        if (eq == false) {
            let value = $("#valueInput").val();
            //If the value is not empty
            if (value != "") {
                //Perform the calculation
                let per = calc / 100;
                //change calc in valueInput to percentage
                $("#valueInput").val(value.slice(0, -calc.length) + per);
                calc = per;
                calculateT(cSign);
            }
        }
    });

    //Function to calculate the total based on the current sign
    function calculate(sign) {
        let acc = "";
        let parcel = total
        //What sign is selected
        switch (sign) {
            case "+":

                total = total + parseFloat(calc);
                //Numerical total
                total = parseFloat(total.toFixed(2));
                //String calculation to display in the history
                acc = parcel + "+" +calc + "=" + total;
                break;
            case "-":
                total = total - parseFloat(calc);
                //Numerical total
                total = parseFloat(total.toFixed(2));
                //String calculation to display in the history
                acc = parcel + "-" +calc + "=" + total;
                break;
            case "*":
                total = total * parseFloat(calc);
                //Numerical total
                total = parseFloat(total.toFixed(2));
                //String calculation to display in the history
                acc = parcel + "*" +calc + "=" + total;
                break;
            case "/":
                total = total / parseFloat(calc);
                //Numerical total
                total = parseFloat(total.toFixed(2));
                //String calculation to display in the history
                acc = parcel + "/" +calc + "=" + total;
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
        //save last calculation in a array to local storage
        lastConts.push(acc);
        localStorage.setItem("lastConts", JSON.stringify(lastConts));
        //Scroll to bottom
        var objDiv = document.getElementById("last-calc");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    //Function similar to calculate but this is executed when the equals sign is not pressed and the user presses a sign to update the current total
    function calculateT(sign) {
        let acc = 0;
        switch (sign) {
            case "+":
                acc = total + parseFloat(calc);
                acc = parseFloat(acc.toFixed(2));

                break;
            case "-":
                acc = total - parseFloat(calc);
                acc = parseFloat(acc.toFixed(2));
                break;
            case "*":
                acc = total * parseFloat(calc);
                acc = parseFloat(acc.toFixed(2));
                break;
            case "/":
                acc = total / parseFloat(calc);
                acc = parseFloat(acc.toFixed(2));
                break;
        }
        $("#resultT").text(acc);
    }

    //Get the mode from local storage
    var mode = localStorage.getItem("mode");
    //If mode is dark or null
    if (mode == "dark" || mode == null) {
        darkMode();
    } else {
        lightMode();
    }

    //Function to change the mode to dark
    function darkMode() {
        //Change the mode in local storage
        localStorage.setItem("mode", "dark");
        //Change the mode in the body
        document.body.classList.remove("body-light");
        document.body.classList.add("body-dark");
        //Change the mode in the button mode
        document.getElementById("mode").classList.remove("btn-dark");
        document.getElementById("mode").classList.add("btn-light");
        document.getElementById("group").classList.remove("btn-dark");
        document.getElementById("group").classList.add("btn-light");
        document.getElementById("icon").classList.remove("fa-moon");
        document.getElementById("icon").classList.add("fa-sun");
        //change the mode in the calculator
        document.getElementById("calculator").classList.remove("bg-light-mode");
        document.getElementById("calculator").classList.add("bg-dark-mode");

        //add class to all the buttons with class btn-mode
        var btns = document.getElementsByClassName("btn-mode");
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove("btn-light-mode");
            btns[i].classList.add("btn-dark-mode");
        }
        //change screen mode
        document.getElementById("screen").classList.remove("light-screen");
        document.getElementById("screen").classList.add("dark-screen");
        //change the mode of input
        document.getElementById("valueInput").classList.remove("input-light");
        document.getElementById("valueInput").classList.add("input-dark");
        //change the mode of last-calc
        document.getElementById("last-calc").classList.remove("input-light");
        document.getElementById("last-calc").classList.add("input-dark");
        //change the mode of resultT
        document.getElementById("resultT").classList.remove("resultT-light");
        document.getElementById("resultT").classList.add("resultT-dark");
        //change mode in all li in last-calc
        let lis = document.getElementById("last-calc").getElementsByTagName("li");
        for (let i = 0; i < lis.length; i++) {
            lis[i].classList.remove("calc-light");
            lis[i].classList.add("input-dark");
        }
    }

    //Function to change the mode to light
    function lightMode() {
        //Change the mode in local storage
        localStorage.setItem("mode", "light");
        //Change the mode in the body
        document.body.classList.remove("body-dark");
        document.body.classList.add("body-light");
        //Change the mode in the button mode
        document.getElementById("mode").classList.remove("btn-light");
        document.getElementById("mode").classList.add("btn-dark");
        document.getElementById("group").classList.remove("btn-light");
        document.getElementById("group").classList.add("btn-dark");
        document.getElementById("icon").classList.remove("fa-sun");
        document.getElementById("icon").classList.add("fa-moon");
        //change the mode in the calculator
        document.getElementById("calculator").classList.remove("bg-dark-mode");
        document.getElementById("calculator").classList.add("bg-light-mode");
        //add class to all the buttons with class btn-mode
        let btns = document.getElementsByClassName("btn-mode");
        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove("btn-dark-mode");
            btns[i].classList.add("btn-light-mode");
        }
        //change screeen mode
        document.getElementById("screen").classList.remove("dark-screen");
        document.getElementById("screen").classList.add("light-screen");
        //change the mode of input
        document.getElementById("valueInput").classList.remove("input-dark");
        document.getElementById("valueInput").classList.add("input-light");
        // change mode of last-calc
        document.getElementById("last-calc").classList.remove("input-dark");
        document.getElementById("last-calc").classList.add("input-light");
        //change the mode of resultT
        document.getElementById("resultT").classList.remove("resultT-dark");
        document.getElementById("resultT").classList.add("resultT-light");
        //change mode in all li in last-calc
        var lis = document.getElementById("last-calc").getElementsByTagName("li");
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove("input-dark");
            lis[i].classList.add("calc-light");
        }
    }

    //Function to change the mode when the button is clicked and save the mode in local storage
    $("#mode").click(function() {
        //If mode is dark or null
        if (mode == "dark" || mode == null) {
            lightMode();
            mode = "light";
            localStorage.setItem("mode", mode);
        } else {
            darkMode();
            mode = "dark";
            localStorage.setItem("mode", mode);
        }
    });

    //Function to open the modal with your names
    $("#group").click(function() {
        if (mode == "dark" || mode == null) {
            Swal.fire({
                icon: 'info',
                title: 'Projeto calculadora',
                text: 'Calculadora desenvolvida em HTML, CSS e JavaScript para a disciplina de Matemática A do 11ºAno do Agrupamento de Escolas de Oliveira do Hospital.',
                footer: 'Projeto desenvolvido por: Francisco Lameiras & co',
                color: '#fff',
                background: '#333333',
                iconColor: '#fff',
                customClass: {
                    confirmButton: 'btn btn-mode btn-dark-modal',
                    footer: 'border-top border-dark-mode'
                },
                buttonsStyling: false,
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Projeto calculadora',
                text: 'Calculadora desenvolvida em HTML, CSS e JavaScript para a disciplina de Matemática A do 11ºAno do Agrupamento de Escolas de Oliveira do Hospital.',
                footer: 'Projeto desenvolvido por: Francisco Lameiras & co',
                color: '#333333',
                background: '#fff',
                iconColor: '#333333',
                customClass: {
                    confirmButton: 'btn btn-mode btn-light-modal',
                    footer: 'border-top border-light-mode'
                },
                buttonsStyling: false,
            });
        }

    });

});
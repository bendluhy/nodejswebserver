function login()
{
    var username = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
    $.ajax({
        type: "POST",
        url: "dev/login",
        data: {user: username, pass: password},
        success: function(output)
        {
            console.log("He")
            window.location.href = "/dev/home"
        }
    }).done()

}
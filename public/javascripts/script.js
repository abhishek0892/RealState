
function updateProfile(){
    /* $('#name').html("<%=user.name%>");
     $('#mobile').html("<%=user.mobile%>");
     $('#username').html("<%=user.username%>");
     $('#role').html("<%=user.role%>");*/
    var form  = $('#updateForm').html();

    $.ajax({
        type: "get",
        url: '/user/account/updatedUser/<%=user.username%>',
        contentType:'json',
        success: function(user){
            if(!user.user){
                location.reload();
            }
            $('#name').html(user.user.name)
            $('#mobile').html(user.user.mobile);
            $('#username').html(user.user.username);
            $('#role').html(user.user.role);

            /!*document.getElementById("name").innerHTML = "abhishek";*!/             //  works as well
        }
    });
}


function loadUserInfo() {
    //alert(JSON.stringify(<%=user%>));
    document.getElementById("name").innerHTML = "<%=user.name%>";
    document.getElementById("username").innerHTML = "<%=user.username%>";
    document.getElementById("mobile").innerHTML = "<%=user.mobile%>";
    document.getElementById("role").innerHTML = "<%=user.role%>";
}
function updateUserInfo() {

    // alert(document.getElementById("username").innerHTML);
    document.getElementById("e_name").value = $("#name").html();
    document.getElementById("e_username").innerHTML = $("#username").html();
    document.getElementById("e_mobile").value = $("#mobile").html();
    document.getElementById("e_role").innerHTML = $("#role").html();
}
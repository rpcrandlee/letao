// 进度条功能
NProgress.configure({
    showSpinner: false
});
$(document).ajaxStart(function () {
    NProgress.start();
});
$(document).ajaxStop(function () {
    setTimeout(function () {
        NProgress.done();
    }, 500);
});

// 非登录页面判断
if (location.href.indexOf("login.html") == -1) {
    $.ajax({
        type: "get",
        url: "/employee/checkRootLogin",
        success: function (data) {
            if (data.error === 400) {
                location.href = "login.html";
            }
        }
    })
}
//二级分类显示隐藏功能
$(".child").prev().on("click", function () {
    $(this).next().slideToggle();
});
//侧边栏显示隐藏功能
$(".icon_menu").on("click", function () {
    $(".lt_aside").toggleClass("now");
    $(".lt_main").toggleClass("now");
});
//退出功能
$(".icon_logout").on("click", function () {
    $("#logoutModal").modal("show");

    // 发送ajax 请求，退出系统
    $(".btn_logout").off().on("click", function () {
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            success: function (data) {
                if (data.success) {
                    location.href = "login.html";
                }
            }
        });
    });
});
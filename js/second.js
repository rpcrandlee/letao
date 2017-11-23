$(function () {
    var $form = $("form");
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (info) {
                $("tbody").html(template("tpl", info));
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPage: Math.ceil(info.total / pageSize),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }
    render();
    $(".btn_add").on("click", function () {
        $("#addModal").modal("show");
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (info) {
                $(".dropdown-menu").html(template("tpl2", info));
            }
        });
    });

    $(".dropdown-menu").on("click", "a", function () {
        $(".dropdown-text").text($(this).text());
        $("[name='categoryId']").val($(this).data("id"));
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    })
    $("#fileupload").fileupload({
        dataType: "json",
        done: function (e, data) {
            console.log(data);
            console.log(data.result.picAddr);
            $(".img_box img").attr("src", data.result.picAddr);
            $("[name='brandLogo']").val(data.result.picAddr);
            $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    $form.bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类的名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传品牌图片"
                    }
                }
            }
        },

    });

    $form.on("success.form.bv", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $form.serialize(),
            success: function (info) {
                console.log(info)
                if (info.success) {
                    $("#addModal").modal("hide");

                    currentPage = 1;
                    render();

                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();

                    $(".dropdown-text").text("请选择一级分类");
                    $("[name='categoryId']").val('');
                    $(".img_box img").attr("src", "images/none.png");
                    $("[name='brandLogo']").val();
                }
            }
        })
    })
})
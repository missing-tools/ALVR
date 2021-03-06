define([
    "lib/lodash",
    "app/driverList",
    "text!app/templates/wizard.html",
    "i18n!app/nls/wizard",
    "css!app/templates/wizard.css"
], function (_, driverList, wizardTemplate, i18n) {
    return function (alvrSettings) {


        this.showWizard = function () {
            var currentPage = 0;
            var compiledTemplate = _.template(wizardTemplate);
            var template = compiledTemplate(i18n);

            $("#setupWizard").remove();
            $("body").append(template);
            $(document).ready(() => {

                driverList.fillDriverList("driverListPlaceholder");

                $('#setupWizard').modal({
                    backdrop: 'static',
                    keyboard: false
                });

                $("#addFirewall").click(() => {
                    $.get("firewall-rules/add", undefined, (res) => {
                        if (res == -1) {
                            Lobibox.notify("error", {
                                size: "mini",
                                rounded: true,
                                delayIndicator: false,
                                sound: false,
                                msg: i18n.firewallFailed
                            })
                        } else {
                            Lobibox.notify("success", {
                                size: "mini",
                                rounded: true,
                                delayIndicator: false,
                                sound: false,
                                msg: i18n.firewallSuccess
                            })
                        }
                    })
                })

                $(".poseOffsetButton").change((ev) => {
                    var target = $(ev.target);

                    var poseTimeOffsetTarget = $("#_root_headset_controllers_content_poseTimeOffset");

                    switch (target.attr("value")) {
                        case "normal":
                            poseTimeOffsetTarget.val("0.01");
                            break;
                        case "medium":
                            poseTimeOffsetTarget.val("-0.03");
                            break;
                        case "fast":
                            poseTimeOffsetTarget.val("-1");
                            break;
                        default:
                            break;
                    }
                    alvrSettings.storeParam(poseTimeOffsetTarget);

                    console.log(target.attr("value"))
                })

                $(".performanceOptions").change((ev) => {
                    var target = $(ev.target);

                    var resolutionTarget = $("#_root_video_renderResolution_scale-choice-");
                    resolutionTarget.prop("checked", true);
                    alvrSettings.storeParam(resolutionTarget);

                    var resolutionScaleTarget = $("#_root_video_renderResolution_scale");
                    var enableFfrTarget = $("#_root_video_foveatedRendering_enabled");
                    var ffrStrengthTarget = $("#_root_video_foveatedRendering_content_strength");
                    var bitrateTarget = $("#_root_video_encodeBitrateMbs");

                    switch (target.attr("value")) {
                        case "compatibility":
                            resolutionScaleTarget.val(0.75);
                            bitrateTarget.val(15);
                            enableFfrTarget.prop("checked", true);
                            ffrStrengthTarget.val(2);
                            
                            var h264CodecTarget = $("#_root_video_codec_H264-choice-");
                            h264CodecTarget.prop("checked", true);
                            alvrSettings.storeParam(h264CodecTarget);
                            break;
                        case "visual_quality":
                            resolutionScaleTarget.val(1);
                            bitrateTarget.val(40);
                            enableFfrTarget.prop("checked", false);

                            var hevcCodecTarget = $("#_root_video_codec_HEVC-choice-");
                            hevcCodecTarget.prop("checked", true);
                            alvrSettings.storeParam(hevcCodecTarget);
                            break;
                        default:
                            break;
                    }
                    alvrSettings.storeParam(resolutionScaleTarget);
                    alvrSettings.storeParam(enableFfrTarget);
                    alvrSettings.storeParam(ffrStrengthTarget);
                    alvrSettings.storeParam(bitrateTarget);

                    console.log(target.attr("value"))
                })

                $("#wizardNextButton").click(() => {

                    if (currentPage >= $("#wizardMain").children().length - 1) {
                        $('#setupWizard').modal('hide');
                        alvrSettings.disableWizard();
                        return;
                    }

                    if (currentPage >= $("#wizardMain").children().length - 2) {
                        $("#wizardNextButton").text(i18n.buttonClose)
                    }


                    $($("#wizardMain").children().get(currentPage)).hide();
                    $($("#wizardMain").children().get(currentPage + 1)).show();

                    $("#wizardNextButton").blur();

                    currentPage += 1;
                })

            });

        }



    };
});
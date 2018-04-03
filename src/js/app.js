$( function() {
    var linkObj = {
        base: "https://calendar.google.com/calendar/r/eventedit?",
        text: "",
        dates: "",
        details: "",
        location: "",
        trp: "&trp=false",
        sprop: "&sprop",
        sprop_name: "&sprop=name:",
        sf: "&sf=true",
        output: "&output=xml "
    };

    init();
    initEvents();

    function init() {
        $('.clockpicker').clockpicker();

        $('.datepicker').datepicker({
            format: "yyyy/mm/dd",
            autoclose: true
        });
    }

    function initEvents () {
        $('.btn-create-link').on('click', function() {
            var link = generateLink();
            var $compiledLink = $('#compiled-link');
            var $compiledLinkCheck = $('#compiled-link-check');
            showLoader('#link-create-from');

            if( validateForm() ) {
                $.ajax({
                    url: 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=AIzaSyDv1qnkoZbsqUf6-FDbYoPD8z_2AF97-rg',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: '{ longUrl: "' + link +'"}',
                    dataType: 'json'
                }).then(function(res){
                    link = res.id;
                }, function (err) {
                    console.log(err)
                }).then(function (res) {
                    $compiledLink.val( link );
                    $compiledLinkCheck.attr('href', link);
                    hideLoader('#link-create-from');
                    displayCompiledLink (true);
                });

                outTooltipFunc();
            }
        });

        $('#compiled-link-copy').on('click', function() {
            copyToClipboard();
        });

        $('#compiled-link-copy').on('onmouseout', function() {
            outTooltipFunc();
        });

        $('input, textarea').on('click focus change', function(e) {
            clearErrors(e.currentTarget);
        });

        $('#link-create-from').on('change keydown', function() {
            displayCompiledLink (false);
            displayCompileBtn ();
        });
    }

    function generateLink() {
        var link        = "",
            text        = $("[name='event_name']").val(),
            details     = $("[name='event_details']").val(),
            location    = $("[name='event_location']").val(),
            dateStart   = formatDate( $("[name='date_start']").val() )  || "",
            dateEnd     = formatDate( $("[name='date_end']").val() )    || "",
            timeStart   = formatTime( $("[name='time_start']").val() )  || "",
            timeEnd     = formatTime( $("[name='time_end']").val() )    || "";

        if ( dateStart && dateEnd && timeStart && timeEnd ) {
            var dates = dateStart + timeStart + "/" + dateEnd + timeEnd;
        }

        linkObj.text        = text      ? "text=" + text           : "";
        linkObj.details     = details   ? "&details=" + details    : "";
        linkObj.location    = location  ? "&location=" + location  : "";
        linkObj.dates       = dates     ? "&dates=" + dates        : "";

        for (var key in linkObj) {
            link += linkObj[key];
        }

        return link
    }

    function formatDate(date){
        return date.replace(/\//g, "")
    }

    function formatTime(time){
        return "T" + time.replace(/:/g, "") + "00"
    }

    function copyToClipboard() {
        var copyText = document.getElementById("compiled-link");
        copyText.select();
        document.execCommand("Copy");

        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copied!";
    }

    function outTooltipFunc() {
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copy to clipboard";
    }

    function validateForm() {
        var $form = $("#link-create-from");
        var fields = $form.find('input, textarea:not([readonly])');
        var isValid = true;

        $(fields).each(function( index, element ) {
            if( !$(element).val() ) {
                $(element).addClass('is-invalid');
                isValid = false;
            }
        });

        return isValid
    }

    function displayCompiledLink (isValid) {
        if(isValid) {
            $('.compiled-link-container').show();
        } else {
            $('.compiled-link-container').hide();
        }
    }

    function displayCompileBtn () {
        var fields = $("#link-create-from").find('input, textarea:not([readonly])');
        var isDisabled = false;

        $(fields).each(function( index, element ) {
            if( !$(element).val() ) {
                isDisabled = true;
            }
        });

        $(".btn-create-link").attr('disabled', isDisabled);
    }

    function clearErrors(elem) {
        $(elem).removeClass('is-invalid');
    }

    function showLoader(selector, transition) {
        if($(selector).css('position') === 'static') {
            $(selector).css({'position' : 'relative'})
        }

        hideLoader(selector);

        $(selector).append('<div class="loader" style="display: none"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>');
        $(selector).find('.loader').fadeIn(transition || 300);
    }

    function hideLoader(selector, transition) {
        $(selector).children('.loader').fadeOut(transition || 300, function() { $(this).remove() })
    }
} );

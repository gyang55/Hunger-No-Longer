$(document).ready(function() {

    //Click on plus icon to add another food input form
    $('#plus').click(() => {
        $('form:first-of-type').clone(true).appendTo('.foodInput');
    })

    // Click on the camera icon and shows the popup
    $('#modalShow').click(() => {
        $('#popup-container').show();
    })

    // close modal popup
    $('#close-btn').click(() => {
        $('#popup-container').hide();

    })

    // Get the value of dropdown menu and give it to the food name input
    $('form').on('click', 'a', function() {

        $(this).parent().parent().siblings('.foodname').val(`${$(this).attr('value')}`);

    })

    /*  Access user device camera
     This feature block of code was adapted from the tutorial found here:
     https://www.youtube.com/watch?v=YoVJWZrS2WU 
     https://www.youtube.com/watch?v=nhX9EUGIZ6o */

    /* Once click on the "take a photo" the modal has to be closed.
    and the DOM video and shoot button have to be shown.
    */
    $('#snap').click(() => {
        // Hide popup modal.
        $('#popup-container').hide();

        //Display video and shoot button
        $('#video').show();
        $('#shoot').show();

        // If user has input device, play the video.
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(stream => {
                video.srcObject = stream;
                video.play();
            })
        }
    })

    // create canvas element.
    let canvas = $('#canvas');
    let context = canvas.get(0).getContext('2d');

    var dataURI;
    $('#shoot').click(() => {

        // Hide the video and shoot button.
        $('#video').hide();
        $('#shoot').hide();

        // Draw the image and display it on the canvas.
        context.drawImage(video, 0, 0, 320, 100);

        // Get image URL in base64 encoded string.
        dataURI = canvas[0].toDataURL('image/jpeg');

    })


    // Choose image from phone
    var imgURL;
    $('#formFileSm').on('change', function() {

        // Check if the files are uploaded
        if (this.files && this.files[0]) {
            var file = this.files[0];
            console.log(file.toDataURL('image/jpeg'));
            imgURL = URL.createObjectURL(this.files[0]);
            console.log(imgURL);
            /* var reader = new FileReader();
            reader.readAsDataURL(imgURL);
            reader.onloadend = () => {
                    var base64 = reader.result;
                    console.log(base64);
                } */
            /* db.collection('BusinessNews')
                .where('Title', '==', 'LectOver News3')
                .get()
                .then((snap) => {
                    snap.forEach((doc) => {
                        console.log(doc.data().Image);
                        $('#try img').attr('src', `${doc.data().Image}`)
                    })
                }) */

        }

    })


    // Submit the image selected and hide the popup.
    $('#imgSubmit').click(() => {
        // Hide popup modal.
        $('#popup-container').hide();

        // Send the image URL to backend by ajax.
    })

    /**
     * Reset the form 
     */
    $('#reset').click(() => {
        $('form').each((i, dom) => {
            $(dom)[0].reset();
        })
        $('#newsTitle').val('');
    })

    /**
     * Update business news posts.
     * 
     * @param content name of business
     * @param bestDate address of business
     * @param title phone number of business
     * @param title phone number of business
     * @param postDate phone number of business
     */
    function updateBusinessNews(content, bestDate, title, img, postDate) {
        var updateBusinessNews = db.collection("BusinessNews");

        var user = firebase.auth().currentUser;
        updateBusinessNews.add({
            //UID: user.uid,
            Content: content,
            BestDate: bestDate,
            Title: title,
            Image: img,
            PostDate: postDate,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
            window.location.href = './BusRegisFeedBack.html';
        });
    }

    /**
     * Retrieves business news form information and update businessNews collection in firebase.
     */
    function getInfo() {
        $("#submitButton").click(function() {
            var foodArr = []; // Array to store food name in each form
            var dateArr = []; // Array to store food name in each form
            $('form').each((i, dom) => {
                foodArr.push($(dom).find('.foodname').val()) // Put food name in each form into a array
                dateArr.push($(dom).find('.inputDate').val()); // Put best use date in each form into a array
            });

            /** 
             * Get current date as post date.
             */
            var currentdate = new Date();
            var twoDigitMonth = ((currentdate.getMonth().length + 1) === 1) ? (currentdate.getMonth() + 1) : '0' + (currentdate.getMonth() + 1);
            var postDate = currentdate.getFullYear() + "-" + twoDigitMonth + '-' + currentdate.getDate();

            var content = foodArr;
            var bestDate = dateArr;
            var title = $('#newsTitle').val();
            var img = dataURI ? dataURI : imgURL;

            updateBusinessNews(content, bestDate, title, img, postDate);
        });
    }
    getInfo();
})
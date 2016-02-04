;/**
 * @author Rufus Mbugua
 * @email mbuguarufus@gmail.com
 */

// Upload Images to the Server
jQuery.fn.extend({
  imageUpload: function(path, options) {
    // Get the user from the id of the input

    // Hide the actual image, from the server
    $('.actual-image').hide();
    // Create an instance of a FileReader to parse the image from the Input File.
    var oFReader = new FileReader();
    oFReader.readAsDataURL($('input[type="file"].image-file').files[0]);


    // All functions that follow are attached to the onload instance of the FileReader
    oFReader.onload = function(oFREvent) {
      document.getElementById("imagePreview").src = oFREvent.target.result;
      // Show the imagePreview and manipulate the attributes.
      $('.image-preview').show();
      $('.image-preview').attr('data-cropped', 'false');

      // Destroy any previous instances if the cropper
      $('.image-preview').cropper('destroy');
      // Initialize the cropper with options
      $('.image-preview').cropper(options);
      // Show the Crop Image Button
      $('a.crop-image-btn').show();

      $('a.crop-image-btn').on('click', function(e) {
        canvas = $('.image-preview').cropper('getCroppedCanvas');
        canvas.toBlob(function(blob) {
          var data = new FormData();
          var post_url = path + '/updateAvatar';

          data.append(user, blob);

          // Ajax Request that posts to the route specified by the POST_URL
          $.ajax({
            url: post_url,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data) {
              if (data.success) {
                // Reset any html components and Cropper instances
                $('.image-preview').cropper('destroy');
                $('.image-preview').hide();
                $('.actual-image').show();
                $('.crop-image-btn').hide();

                // Update the images with the new images
                $('.actual-image').attr('src', data.URL_TO_UPLOADED_IMAGE);

              } else {
                alert(data.ERROR_MESSAGE);
              }
            },
            error: function() {
              alert(CUSTOM_ERROR_MESSAGE);
            }
          });
        }, 'image/jpeg');
      });
    };
  }
});

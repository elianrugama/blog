
    $(document).ready(function() {
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf('=') + 1);
        var entryContainer = $('#datos');
      
        db.collection('usuarios').doc(id).get().then(function(doc) {
          var data = doc.data();
          console.log(data)
          var entryHTML = `
            <div class="entry">
              <h3>${data.title}</h3>
              <img src="${data.image}" width="50" height="50"/>
              <p>${data.content}</p>
              <ul class="comments">
          `;
          if (data.comments && data.comments.length > 0) {
            data.comments.forEach(function(comment) {
              var commentText = comment.text;
              var userName = comment.userName;
              var userPhotoURL = comment.userPhotoURL;
              entryHTML += `
                <li>
                  <img src="${userPhotoURL}" width="30" height="30" />
                  <strong>${userName}:</strong> ${commentText}
                </li>
              `;
            });
          } else {
            entryHTML += `
              <li>No hay comentarios</li>
            `;
          }
          entryHTML += `
              </ul>
              <form>
                <input type="text" name="comment" placeholder="Agrega un comentario..." />
                <button type="submit">Agregar</button>
              </form>
            </div>
          `;
      
          var entry = $(entryHTML);
          var commentForm = entry.find('form');
          var commentInput = entry.find('input[name="comment"]');
      
          commentForm.submit(function(event) {
            event.preventDefault();
            var commentText = commentInput.val().trim();
            if (commentText !== '') {
              var user = firebase.auth().currentUser;
              var userId = user.uid;
              var userName = user.displayName;
              var userPhotoURL = user.photoURL;
              var commentData = {
                text: commentText,
                userId: userId,
                userName: userName,
                userPhotoURL: userPhotoURL
              };
              db.collection('usuarios').doc(id).update({
                comments: firebase.firestore.FieldValue.arrayUnion(commentData)
              }).then(function() {
                console.log('Comentario agregado');
                console.log('Gracias por comentar, ' + userName);
                commentInput.val('');
              }).catch(function(error) {
                console.error('Error al agregar el comentario: ', error);
              });
            }
          });
      
          entryContainer.append(entry);
        });
      });
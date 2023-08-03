window.onload = function () {
  var id_length = 13;
  var socket = new WebSocket("ws://10.200.50.111:3030");

  function handleOpen() {
    console.log("--- Client is connected ---");
  }

  function handleClose() {
    console.log("--- Client is closed ---");
  }

  function handleError(error) {
    console.log("--- Client occured error ---", error);
  }

  function handleMessage(response) {
    socket && receiveMessage(response.data);
  }

  function blob2arraybuffer(blob) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  function arraybuffer2String(arraybuffer) {
    var parts = new Uint8Array(arraybuffer);
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(parts);
  }

  function arraybuffer2Url(arraybuffer) {
    var blob = new Blob([arraybuffer], { type: "image/png" });
    var url = URL.createObjectURL(blob);
    return url;
  }

  function receiveMessage(response) {
    blob2arraybuffer(response).then(function (buffer) {
      var id = arraybuffer2String(buffer.slice(0, id_length + 1));
      console.log("id", id);

      var url = arraybuffer2Url(buffer.slice(id_length + 1));
      var img = document.getElementsByTagName("img")[0];
      img.src = url;
      img.onload = function () {
        URL.revokeObjectURL(url);
      };
    });
  }

  socket.addEventListener("open", handleOpen, false);
  socket.addEventListener("close", handleClose, false);
  socket.addEventListener("error", handleError, false);
  socket.addEventListener("message", handleMessage, false);

  var btn = document.getElementsByTagName("button")[0];
  btn.addEventListener("click", function () {
    socket.readyState === 1 && socket.send("data_1691042256152");
  });
};

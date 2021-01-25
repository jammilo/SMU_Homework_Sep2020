$(document).ready(function() {
    doWork();
});

function doWork() {
    d3.json("samples.json").then((data) => {
        console.log(data);
    });

};
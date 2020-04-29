var main = {
    variables: {
        pieces: {
            k: {
                img: '&#9812;'
            },
            q: {
                img: '&#9813;'
            },
            b: {
                img: '&#9815;'
            },
            n: {
                img: '&#9816;'
            },
            r: {
                img: '&#9814;'
            },
            p: {
                img: '&#9817;'
            },
            K: {
                img: '&#9818;'
            },
            Q: {
                img: '&#9819;'
            },
            B: {
                img: '&#9821;'
            },
            N: {
                img: '&#9822;'
            },
            R: {
                img: '&#9820;'
            },
            P: {
                img: '&#9823;'
            }
        }
    }
}

function getChessBoard(id) {
    $.ajax({
        url: "/start/board",
        type: "get",
        data: {id: id},
        success: function (data) {
            console.log(JSON.stringify(data));
            $('.gamecell').html('');
            $('.gamecell').attr('chess', 'null');
            $('#game_id').html(id);

            $('.gamecell grey').html('');
            $('.gamecell grey').attr('chess', 'null');

            var jsonData = JSON.parse(data);
            for (var i = 0; i < jsonData.boardDto.boardValue.length; i++) {
                var piece = jsonData.boardDto.boardValue[i];
                $('#' + piece.location).html(main.variables.pieces[piece.pieceName].img);
                $('#' + piece.location).attr('chess', piece.pieceName);
            }

            $('#whiteScore').html("White score : " + jsonData.whiteScore);
            $('#blackScore').html("Black score : " + jsonData.blackScore);

            var turn = "white";
            if(jsonData.turnIsBlack === "1") {
                turn = "black";
            }
            $('#turn').html("It's " + turn + " Turn!");
        },
        error: function (errorThrown) {
            alert(JSON.stringify(errorThrown));
        },
    });
}

function postNewGame() {
    var game_id = document.getElementById("game_id").innerHTML;

    $.ajax({
            type: 'post',
            url: '/start/new/game',
            data: {"game_id": game_id.toString()},
            success: function (data) {
                $('#game_id').html(game_id);

                $('.gamecell').html('');
                $('.gamecell').attr('chess', 'null');

                $('.gamecell grey').html('');
                $('.gamecell grey').attr('chess', 'null');

                var jsonData = JSON.parse(data);
                for (var i = 0; i < jsonData.boardValue.length; i++) {
                    var piece = jsonData.boardValue[i];
                    $('#' + piece.location).html(main.variables.pieces[piece.pieceName].img);
                    $('#' + piece.location).attr('chess', piece.pieceName);
                }

                $('#turn').html("It's White Turn!");
            },
            error: function (xhr, status, error) {
                alert(error.toString());
            },
        }
    );
}


function convertPiece(pieceName) {
    for (let piecesKey in main.variables.pieces) {
        if (piecesKey == pieceName) {
            return piecesKey;
        }
    }
    return null;
}


function allowDrop(ev) {
    // 고유의 동작 제거
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var now = ev.dataTransfer.getData("text");
    var des = ev.target.id;
    var game_id = document.getElementById("game_id").innerHTML;
    // console.log(now + " to " + des.toString());
    postChessBoard({"game_id": game_id.toString(), "now": now.toString(), "des": des.toString()});
}

function postChessBoard(json) {
    $.ajax({
        type: 'post',
        url: '/start/move',
        data: json,
        dataType: 'text',
        error: function (xhr, status, error) {
            alert(error.toString());
        },
        success: function (data) {
            var jsonData = JSON.parse(data);
            // console.log(JSON.stringify(jsonData));

            if (jsonData.progress == "CONTINUE") {
                var nowImg = $('#' + json.now).html();
                $('#' + json.des).html(nowImg);
                $('#' + json.des).attr('chess', $('#' + json.now).chess);
                $('#' + json.now).html('');
                $('#' + json.now).attr('chess', 'null');

                $('#whiteScore').html("whiteScore : " + jsonData.chessGameScoresDto.whiteScore.value);
                $('#blackScore').html("blackScore : " + jsonData.chessGameScoresDto.blackScore.value);

                $('#turn').html("It's " + jsonData.turn + " Turn!");
            }
            if (jsonData.progress == "ERROR") {
                alert("움직일 수 없는 경우입니다.");
            }
            if (jsonData.progress == "END") {
                getChessBoardResult();
            }
        }
    });
}

function getChessBoardResult() {
    var game_id = document.getElementById("game_id").innerHTML;

    $.ajax({
        url: "/start/winner",
        type: "get",
        data: {"game_id": game_id},
        success: function (data) {
            var jason = JSON.parse(data);
            alert("승자는" + jason.name + "입니다.")
        },
        error: function (errorThrown) {
            alert(errorThrown);
        },
    });
}

function getChessGames() {
    $.ajax({
        url: "/start/boards",
        type: "get",
        success: function (data) {
            var res = JSON.parse(data);
            // console.log(JSON.stringify(data));
            var chessGameVos = res.chessGameVos;
            for (var i = 0; i < chessGameVos.length; i++) {
                add(chessGameVos[i].id);
            }
        },
        error: function (errorThrown) {

        },
    });
}

function add(id) {
    var element = document.createElement("input");
    element.type = "button";
    element.value = id + "번 체스 게임";
    element.onclick = function () {
        getChessBoard(id);
    };

    var chessBar = document.getElementById("chessBar");
    chessBar.appendChild(element);
}

$(document).ready(function () {
    $('.gamecell').attr({
        "draggable": "true",
        "ondragstart": "drag(event)",
        "ondrop": "drop(event)",
        "ondragover": "allowDrop(event)"
    });
});

function postEndGame() {
    var game_id = document.getElementById("game_id").innerHTML;

    $.ajax({
        type: 'post',
        url: '/end',
        data: {"game_id": game_id},
        dataType: 'text',
        error: function (xhr, status, error) {
            alert(error.toString());
        },
        success: function (data) {
        }
    });
}

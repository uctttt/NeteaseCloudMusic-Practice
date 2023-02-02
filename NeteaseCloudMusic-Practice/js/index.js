$(function() {
    var play;
    var date = new Date();
    var audio = document.getElementById("songPlayer");
    $('#count_hotsongs').css("display", "none");
    $("#songsListPage").css("display", "none");

    $('#Menu>span').click(function() {
        $(this).addClass("checked").siblings('span').removeClass('checked');
    })

    $("#Menu>#rec").click(function() {
        $('#count_hotsongs').css("display", "none");
        $('#count_recommendsongs').css("display", "block");
        $('#count_search').css("display", "none");
        $("#hotSearchWords").css("display", "block");
        $(".resultList").empty();
        $("#inputPlace").val('');
    })
    $("#Menu>#hot").click(function() {
        $('#count_hotsongs').css("display", "block");
        $('#count_recommendsongs').css("display", "none");
        $('#count_search').css("display", "none");
        $("#hotSearchWords").css("display", "block");
        $("#inputPlace").val('');
        $(".resultList").empty();
        $(".hotSongs_date").html(`更新日期:${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
    })
    $("#Menu>#ser").click(function() {
        $('#count_hotsongs').css("display", "none");
        $('#count_recommendsongs').css("display", "none");
        $('#count_search').css("display", "block");
        $("#hotSearchWords").css("display", "block");
        $("#inputPlace").val('');
        $('.clear').css("display", "none");
        $(".resultList").empty()
    })

    $.getJSON('http://localhost:3000/search/hot', function(data) {
        data.result.hots.forEach(function(hotWord) {
            $('.hotWordsList').append(`<div class="hotWords">${hotWord.first}</div>`)
        })
    })

    $(document).on('click', '.hotWords', function() {
        var hotWord = $(this).html()
        $("#inputPlace").val(hotWord)
        search()
    })

    var input = document.getElementById('inputPlace')
    $("#inputPlace").keyup(function() {
        var e = event.keyCode
        if (e == 13) {
            search()
        }
    });

    var suggestList = []
    input.oninput = function() {
        suggestList = []
        $("#hotSearchWords").css("display", "none");
        $(".resultList").empty();
        $(".recWordsList").empty();
        $('.recWords').css("display", "block");
        $('.recWords>.title').html(`搜索“${input.value}”`);
        if (input.value == '') {
            $('.recWords').css("display", "none");
            $('#count_search').css("display", "block");
            $('.clear').css("display", "none");
            $("#hotSearchWords").css("display", "block");
        } else {
            $('.clear').css("display", "inline-block");
            $.getJSON(`http://localhost:3000/search/suggest?keywords=${input.value}`, function(data) {
                var suggest = data.result
                if (suggest.songs != undefined) {
                    suggest.songs.forEach(element => {
                        if (!suggestList.includes(element.name)) {
                            suggestList.push(element.name)
                        }
                    });
                }
                if (suggest.artists != undefined) {
                    suggest.artists.forEach(element => {
                        if (!suggestList.includes(element.name)) {
                            suggestList.push(element.name)
                        }
                    });
                }
                suggestList.forEach(element => {
                    $(".recWordsList").append(`
                    <li class="recWord">
                                <i></i><span>${element}</span>
                            </li>
                    `)
                });
            })
        }
    }

    input.onfocus = function() {
        suggestList = []
        $("#hotSearchWords").css("display", "none");
        $(".resultList").empty();
        $(".recWordsList").empty();
        $('.recWords').css("display", "block");
        $('.recWords>.title').html(`搜索“${input.value}”`);
        if (input.value == '') {
            $('.recWords').css("display", "none");
            $('#count_search').css("display", "block");
            $('.clear').css("display", "none");
            $("#hotSearchWords").css("display", "block");
        } else {
            $('.clear').css("display", "inline-block");
            $.getJSON(`http://localhost:3000/search/suggest?keywords=${input.value}`, function(data) {
                var suggest = data.result
                if (suggest.songs != undefined) {
                    suggest.songs.forEach(element => {
                        if (!suggestList.includes(element.name)) {
                            suggestList.push(element.name)
                        }
                    });
                }
                if (suggest.artists != undefined) {
                    suggest.artists.forEach(element => {
                        if (!suggestList.includes(element.name)) {
                            suggestList.push(element.name)
                        }
                    });
                }
                suggestList.forEach(element => {
                    $(".recWordsList").append(`
                    <li class="recWord">
                                <i></i><span>${element}</span>
                            </li>
                    `)
                });
            })
        }
    }

    function search() {
        $('.recWords').css("display", "none");
        $("#hotSearchWords").css("display", "none");
        $(".resultList").empty();
        let keyWord = $("#inputPlace").val();
        $.getJSON(`http://localhost:3000/search?keywords=${keyWord}`, function(result) {
            let songsList = result.result.songs
            songsList.forEach(song => {
                let artists = ''
                artists = `${song.artists[0].name}`
                song.artists.slice(1).forEach(element => {
                    artists += `/${element.name}`
                })
                let songName = `${song.name}`
                let newsongName = songName.replace(keyWord, `<span id = 'keyWord'>${keyWord}</span>`)
                let newsartists = artists.replace(keyWord, `<span id = 'keyWord'>${keyWord}</span>`)
                $(".resultList").append(
                    `<li class="songsList" id=${song.id}>
                    <div class="newsongs_body">
                    <div>
                    <div class="newsongs_top">
                    ${newsongName}
                    </div>
                    <div class="newsongs_bottom">
                    ${newsartists}-${newsongName}
                    </div>
                    </div>
                    </div>
                    <div class='icon'>
                    <div class='playIco'></div>
                    </div>
                    </li>`)
            });
        })
    }

    $.getJSON("http://localhost:3000/personalized", function(data) {
        if (data.code == 200) {
            data.result.slice(0, 6).forEach(function(songs) {
                let playCount = songs.playCount.toString();
                if (playCount.length == 8) {
                    playCount = `${playCount.slice(0, 4)}.${playCount.slice(4, 5)}万`
                }
                if (playCount.length >= 9) {
                    playCount = `${playCount.slice(0, 2)}.${playCount.slice(2, 3)}亿`
                }
                $("#recommend_songs>ul").append(
                    `<li id=${songs.id}>
                    <span class="playCount">${playCount}</span>
                  <img src="${songs.picUrl}" alt="">
                  <p>${songs.name}</p>
                </li>`
                );
            });
        }
        $('#recommend_songs>ul>li').click(function() {
            var songsList_id = $(this).attr("id")
            $.getJSON(`http://localhost:3000/playlist/detail?id=${songsList_id}`, function(data) {
                if (data.code == 200) {
                    $("#mainPage").css("display", "none");
                    $("#songsListPage").css("display", "block");

                    let userID = data.playlist.userId

                    function getUserPhoto(data) {
                        $.ajaxSettings.async = false;
                        var userPhoto;
                        $.getJSON(`http://localhost:3000/user/detail?uid=${data}`, function(data) {
                            userPhoto = data.profile.avatarUrl
                        });
                        $.ajaxSettings.async = true;
                        return userPhoto
                    }

                    function getUserName(data) {
                        $.ajaxSettings.async = false;
                        var userName;
                        $.getJSON(`http://localhost:3000/user/detail?uid=${data}`, function(data) {
                            userName = data.profile.nickname
                        });
                        $.ajaxSettings.async = true;
                        return userName
                    }
                    let userName = getUserName(userID)
                    let userPhoto = getUserPhoto(userID)

                    let playCount = data.playlist.playCount.toString();
                    if (playCount.length == 8) {
                        playCount = `${playCount.slice(0, 4)}.${playCount.slice(4, 5)}万`
                    }
                    if (playCount.length >= 9) {
                        playCount = `${playCount.slice(0, 2)}.${playCount.slice(2, 3)}亿`
                    }
                    $("#songsListPage").append(
                        `<div id="songsList_head">
                    <div class="songsList_bg"style='background-image:url(${data.playlist.coverImgUrl}')></div>
                    <div class="songsList_detail">
                        <div class="songsList_left" style='background-image:url(${data.playlist.coverImgUrl}'>
                            <span class="type">歌单</span>
                            <span class="playCount">${playCount}</span>
                        </div>
                        <div class="songsList_right">
                            <span class="songsList_name">${data.playlist.name}</span>
                            <div class="user_message">
                            <div class="user_photo" style="background-image: url(${userPhoto});"></div>
                            <div class="user_name">${userName}</div>
                        </div>
                        </div>
                    </div>
                </div>
                <div id="songsList_body">
                    <div class="topText">歌曲列表</div>
                    <ul id="songsList_count">
                    </ul>
                    <div class="topText">精彩评论</div>
                    <ul id="commentsList_count">
                    </ul>
                     <div class="blank" style="height: 3.875rem;width:100%;"></div>
                    <div id="collestBtn">
                        <div class='backBtn'>返回主页</div>
                    </div>
                </div>`
                    );
                }
            });

            $.getJSON(`http://localhost:3000/playlist/track/all?id=${songsList_id}&limit=10&offset=0`, function(data) {
                let i = 0;
                data.songs.forEach(function(song) {
                    let artists = ''
                    if (song.ar.length == 1) {
                        artists = `<a href="http://localhost:3000/artist/detail?id=${song.ar[0].id}">${song.ar[0].name}</a>`
                    } else {
                        artists = `<a href="http://localhost:3000/artist/detail?id=${song.ar[0].id}">${song.ar[0].name}</a>`
                        song.ar.slice(1).forEach(element => {
                            artists += `/<a href="http://localhost:3000/artist/detail?id=${element.id}">${element.name}</a>`
                        })
                    }
                    i++
                    $('#songsList_body>ul#songsList_count').append(`
                    <li class="songsList" id='${song.id}'>
                        <div class="orderNum">${i}</div>
                        <div class="songsList_content">
                            <div class="songs_body">
                                <div>
                                    <div class="songs_top">
                                        ${song.name}
                                    </div>
                                    <div class="songs_bottom">
                                        ${artists}-${song.name}
                                    </div>
                                </div>
                            </div>
                            <div class='icon'>
                            <div class='playIco'></div>
                            </div>
                        </div>
                    </li>`)
                })
            });

            $.getJSON(`http://localhost:3000/comment/hot?id=${songsList_id}&type=2`, function(data) {
                data.hotComments.slice(0, 15).forEach(function(comment) {
                    $('#songsList_body>ul#commentsList_count').append(
                        ` <li class="commentsList">
                        <div class="comment_user" style="background-image: url(${comment.user.avatarUrl});"></div>
                        <div>
                            <div class="comment_top">
                                <div class="left">
                                    <div class="comment_userName">${comment.user.nickname}</div>
                                    <div class="comment_time">${comment.timeStr}</div>
                                </div>
                                <div class="right">${comment.likedCount}</div>
                            </div>
                            <div class="comment_bottom">
                                <span>${comment.content}</span>
                            </div>
                        </div>
                    </li>`
                    )
                })
            });

        });

        $.getJSON(`http://localhost:3000/recommend/songs`, function(data) {
            let i = 0;
            let topSongs = '';
            data.data.dailySongs.slice(0, 20).forEach(function(song) {
                let artists = ''
                artists = `<a href="http://localhost:3000/artist/detail?id=${song.ar[0].id}">${song.ar[0].name}</a>`
                song.ar.slice(1).forEach(element => {
                    artists += `/<a href="http://localhost:3000/artist/detail?id=${element.id}">${element.name}</a>`
                })

                i++
                if (i < 10) {
                    i = `0${i}`
                }
                if (i <= 3) {
                    topSongs = `style="color:#df3436;"`
                } else {
                    topSongs = ``
                }
                $('#hotSongs_content>ul#hotSongs_list').append(`
                <li class="songsList" id='${song.id}'>
                    <div class="orderNum" ${topSongs}>${i}</div>
                    <div class="songsList_content">
                        <div class="songs_body">
                            <div>
                                <div class="songs_top">
                                    ${song.name}
                                </div>
                                <div class="songs_bottom">
                                    ${artists}-${song.name}
                                </div>
                            </div>
                        </div>
                        <div class='icon'>
                        <div class='playIco'></div>
                        </div>
                    </div>
                </li>`)
            })
        });

        $.getJSON("http://localhost:3000/personalized/newsong", function(data) {
            if (data.code == 200) {
                data.result.slice(0, 10).forEach(function(song) {
                        let artistsList = `<span">${song.song.artists[0].name}</span>`
                        song.song.artists.slice(1).forEach(element => {
                            artistsList += `/<span">${element.name}</span>`
                        });

                        $("#new_songs>ul").append(
                            `<li class="songsList" id=${song.id}>
                        <div class="newsongs_body">
                        <div>
                        <div class="newsongs_top">
                        ${song.name}
                        </div>
                        <div class="newsongs_bottom">
                        ${artistsList}-${song.name}
                        </div>
                        </div>
                        </div>
                        <div class='icon'>
                            <div class='playIco'></div>
                            </div>
                        </li>`
                        );
                    },


                );
            }
        });

        $(document).on('click', '.recWords>.title', function() {
            search()
        })

        $(document).on('click', '.clear', function() {
            input.value = ''
            $(".resultList").empty();
            $('.recWords').css("display", "none");
            $('#count_search').css("display", "block");
            $('.clear').css("display", "none");
            $("#hotSearchWords").css("display", "block");
        })

        $(document).on('click', '.recWord', function() {
            $("#inputPlace").val($(this).find('span').html())
            search()
        })

        $(document).on('click', '.songsList', function() {
            var songsList_id = $(this).attr("id")
            $.getJSON(`http://localhost:3000/song/detail?ids=${songsList_id}`, function(data) {
                    var artist = ''
                    artist = data.songs[0].ar[0].name
                    data.songs[0].ar.slice(1).forEach(function(item) {
                        artist += '/' + item.name
                    })

                    $("#musicPlayPage").append(
                        `<div class="musicPlayPage_bg" style="background-image: url(${data.songs[0].al.picUrl});"></div>
                        <div  draggable="true">
                    <div class="titlePicture">
                        <div class="roolPic">
                            <div class="stopIco"></div>
                            <div class="disc">
                                <div class="songPic">
                                    <div style="background-image: url(${data.songs[0].al.picUrl});">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="wordsOfSong">
                        <div class="secondTitle">
                            <span class="name">${data.songs[0].name} -</span>
                            <span class="artist">${artist}</span>
                        </div>
                        <div class="songlrc">
                            <div class="rollingList"></div>
                        </div>
                        </div>
                    <div class="blackBG"></div>
                    <div id="collestBtn">
                        <div class='backBtn'>返回主页</div>
                    </div>`
                    )
                }),

                $.getJSON(`http://localhost:3000/song/url?id=${songsList_id}`, function(data) {
                    $("#songPlayer").attr('src', '')
                    $("#songPlayer").attr('src', data.data[0].url)
                    audio.load();

                    $.getJSON(`http://localhost:3000/lyric?id=${songsList_id}`, function(data) {
                        var text = data.lrc.lyric

                        function getLyricArr() {
                            let lyricArr = text.split("\n");
                            for (let index = 0; index < lyricArr.length; index++) {
                                lyricArr[index] = getLyric(lyricArr[index])
                            }
                            return lyricArr

                            function getLyric(element) {
                                var split1 = element.split("]");
                                var time = split1[0].substr(1);
                                var timeParts = time.split(":");
                                var seconds = +timeParts[1]
                                var mins = +timeParts[0]
                                seconds += mins * 60
                                var words = split1[1]
                                return {
                                    seconds: seconds,
                                    words: words,
                                }
                            }
                        }
                        var lyricArr = getLyricArr();
                        lyricArr = lyricArr.slice(0, -1).filter(item => item.words != '');
                        lyricArr.forEach(word => {
                            $(`.rollingList`).append(`<p class="words">${word.words}</p>`)
                        });
                        $('#songPlayer')[0].ontimeupdate = function() {
                            $.each(lyricArr, function(i) {
                                if ($('#songPlayer')[0].currentTime >= lyricArr[i].seconds) {
                                    $('.rollingList>.words').eq(i).addClass('highlight');
                                    $('.rollingList>.words').eq(i).siblings().removeClass('highlight');
                                    if (i >= 0) {
                                        $('.rollingList').css('transform', `translateY(${-i*32}px)`);
                                    }
                                }
                            });
                            if ($('#songPlayer')[0].ended) {
                                $(`.stopIco`).css("display", "block");
                                $(`.disc`).css("animation-play-state", "paused");
                                play = false
                                audio.load();
                            }
                        };
                        $(`.stopIco`).css("display", "block");
                        $(`.disc`).css("animation-play-state", "paused");
                        play = false
                    })
                }),

                $("#mainPage").css("display", "none");
            $("#songsListPage").css("display", "none");
            $("#musicPlayPage").css("display", "block");

        })
    });

    $(document).on('click', '.roolPic', function() {
        if (play) {
            audio.pause();
            $(`.stopIco`).css("display", "block")
            $(`.disc`).css("animation-play-state", "paused")
            play = false
        } else
        if (!play) {
            audio.play();
            $(`.stopIco`).css("display", "none")
            $(`.disc`).css("animation-play-state", "running")
            play = true
        }
    })
    $(document).on('click', '.backBtn', function() {
        $('.clear').css("display", "none");
        $("#hotSearchWords").css("display", "block");
        $(".resultList").empty();
        $("#songPlayer").attr('src', '');
        $("#mainPage").css("display", "block");
        $("#songsListPage").empty();
        $("#musicPlayPage").empty();
        $("#inputPlace").val('');
        scrollTo(0, 0)
    });

})
let currentSong = new Audio()
let p = ""
let songs=[]

async function getFolders(path){
    let a = await fetch(path);
    let resp = await a.text();
    let div = document.createElement("div")
    div.innerHTML = resp
    let anchtags = div.getElementsByTagName("a")
    let folders = []
    for (let index = 4; index < anchtags.length; index++) {
        let anch = anchtags[index]
        folders.push(anch.href)
    }
    return folders
}

async function getSongs(path){
    let a = await fetch(path);
    let resp = await a.text();
    let div = document.createElement("div")
    songs = []
    div.innerHTML = resp
    let anchtags = div.getElementsByTagName("a")
    for (let index = 0; index < anchtags.length; index++) {
        let anch = anchtags[index]
        if (anch.href.endsWith(".mp3")){
            songs.push(anch.href)
        }
    }
    return songs
}

function playSong(songlink,songpath) {
    if (currentSong.paused == true){
        currentSong.src = songlink
        currentSong.play()
        song = songlink.split(songpath)[1].replace("%20"," ").replace(".mp3","")
    
        play.getElementsByTagName("img")[0].src = "Assets/svg/pause.svg"
        let playbox = document.querySelector(".playbox")
    
        currentSong.addEventListener("timeupdate",()=>{
            let t = currentSong.duration
            let tsec = t%60
            let tmin = (t-tsec)/60
            let l = currentSong.currentTime
            let lsec = l%60
            let lmin = (l-lsec)/60
            playbox.querySelector(".controls").querySelector(".songtime2").innerHTML = `${tmin}:${Math.round(tsec)}`
            playbox.querySelector(".controls").querySelector(".songtime1").innerHTML = `${lmin}:${Math.round(lsec)}`
            playbox.querySelector(".controls").querySelector(".seek").querySelector(".done").style.width = `${(l/t)*100}%`
        })
        playbox.querySelector(".songphoto").querySelector("img").setAttribute("src",`Assets/photo/${song}.jpeg`)
        playbox.querySelector(".songinfo").querySelector(".firstline").innerHTML = `${song.replaceAll("%20"," ").split(" by ")[0]}`
        playbox.querySelector(".songinfo").querySelector(".secline").innerHTML = `${song.replaceAll("%20"," ").split(" by ")[1]}`
    }else{
        currentSong.pause()
        currentSong.src = songlink
        currentSong.play()
        song = songlink.split(songpath)[1].replace("%20"," ").replace(".mp3","")
    
        play.getElementsByTagName("img")[0].src = "Assets/svg/pause.svg"
        let playbox = document.querySelector(".playbox")
    
        currentSong.addEventListener("timeupdate",()=>{
            let t = currentSong.duration
            let tsec = t%60
            let tmin = (t-tsec)/60
            let l = currentSong.currentTime
            let lsec = l%60
            let lmin = (l-lsec)/60
            playbox.querySelector(".controls").querySelector(".songtime2").innerHTML = `${tmin}:${Math.round(tsec)}`
            playbox.querySelector(".controls").querySelector(".songtime1").innerHTML = `${lmin}:${Math.round(lsec)}`
            playbox.querySelector(".controls").querySelector(".seek").querySelector(".done").style.width = `${(l/t)*100}%`
            if (t == l){
                newIndex = songs.indexOf(currentSong.src) + 1
                newslink = songs[newIndex]
                test = newslink.lastIndexOf("/")
                test2 = newslink.slice(test+1,newslink.length-4)
                newspath = newslink.split(test2)[0]
                playSong(newslink,newspath)
            }
        })
        playbox.querySelector(".songphoto").querySelector("img").setAttribute("src",`Assets/photo/${song}.jpeg`)
        playbox.querySelector(".songinfo").querySelector(".firstline").innerHTML = `${song.replaceAll("%20"," ").split(" by ")[0]}`
        playbox.querySelector(".songinfo").querySelector(".secline").innerHTML = `${song.replaceAll("%20"," ").split(" by ")[1]}`
    }

}

async function main(){
    let f1s = await getFolders("/Assets/AutoDetect%20Music/")
    let scroll = document.querySelector(".scroll")
    let spotify = document.querySelector(".spotify")
    p = f1s[3]
    let songs = await getSongs(p)
    for (const song of songs){
        songName = song.split("/AutoDetect%20Music/Popular%20Songs/")[1].replaceAll("%20"," ")
        a = songName.substring(0,songName.length-4)
        b = a.split(" by ")[0]
        c = a.split(" by ")[1]
        html = `<div class="box">
                        <div class="img">
                            <img src="Assets/photo/${a}.jpeg" alt="${song}">
                        </div>
                        <div class="cont">
                            <div class = "line1">${b}</div>
                            <div class = "line2">${c}</div>
                        </div>
                        <button class="green">
                            <div class="tri"></div>
                        </button>
                </div>`
        scroll.innerHTML= scroll.innerHTML+html
    }
    Array.from(scroll.getElementsByTagName("img")).forEach(e=>{
        e.parentElement.parentElement.lastElementChild.addEventListener("click" , (ele) => {
            slink = e.alt
            sname = e.src.split("/photo/")[1].replace("jpeg","")
            spath = slink.split(sname)[0]
            playSong(slink,spath)
        })
    })


    for (const f of f1s) {
        let s = await getSongs(f)
        html2 = `<div class="first">
                    <div class="info">
                        ${f.split("Music/")[1].replaceAll("%20"," ")}
                    </div>

                    <div class="all">

                    </div>
                </div>`
        spotify.innerHTML = spotify.innerHTML + html2

        for (const song of s) {
            fullName = song.split("/AutoDetect%20Music/")[1].replaceAll("%20"," ").replace(".mp3","")
            a = fullName.split("/")[0]
            b = fullName.split("/")[1].split(" by ")[0]
            c = fullName.split("/")[1].split(" by ")[1]
            html2 = `<div class="one">
                            <div class="img">
                                <img src="Assets/photo/${fullName.split("/")[1]}.jpeg" alt="${song}">
                                <button class="green">
                                    <div class="tri"></div>
                                </button>
                            </div>
                            <div class = "main1">${b}</div>
                            <div class = "main2">${c}</div>
                    </div>`
            let first = spotify.querySelectorAll(".first")[f1s.indexOf(f)]
            first.querySelector(".all").innerHTML= first.querySelector(".all").innerHTML+html2
        }
        
    }

    let f2s = await getFolders("/Assets/AutoDetect%20Playlist/")
    for (const f of f2s) {
        let s = await getFolders(f)
        html2 = `<div class="second">
                    <div class="info">
                        ${f.split("Playlist/")[1].replaceAll("%20"," ")}
                    </div>

                    <div class="all">

                    </div>
                </div>`
        spotify.innerHTML = spotify.innerHTML + html2
        
        for (let i = 1; i < s.length; i++) {
            const song = s[i];
            fullName = song.split("/AutoDetect%20Playlist/")[1].replaceAll("%20"," ").replace(".mp3","")
            a = fullName.split("/")[0]
            b = fullName.split("/")[1].split(" by ")[0]
            c = fullName.split("/")[1].split(" by ")[1]
            html2 = `<div class="one">
                            <div class="img">
                                <img src="Assets/photo/${fullName.split("/")[1]}.jpeg" alt="${song}">
                                <button class="green">
                                    <div class="tri"></div>
                                </button>
                            </div>
                            <div class = "main1">${b}</div>
                            <div class = "main2">${c}</div>
                    </div>`
            let second = spotify.querySelectorAll(".second")[f2s.indexOf(f)]
            second.querySelector(".all").innerHTML= second.querySelector(".all").innerHTML+html2
        }
    }

    prev.addEventListener("click",()=>{
        newIndex = songs.indexOf(currentSong.src) - 1
        newslink = songs[newIndex]
        test = newslink.lastIndexOf("/")
        test2 = newslink.slice(test+1,newslink.length-4)
        newspath = newslink.split(test2)[0]
        playSong(newslink,newspath)
    })
    
    next.addEventListener("click",()=>{
        newIndex = songs.indexOf(currentSong.src) + 1
        newslink = songs[newIndex]
        test = newslink.lastIndexOf("/")
        test2 = newslink.slice(test+1,newslink.length-4)
        newspath = newslink.split(test2)[0]
        playSong(newslink,newspath)
    })

    play.addEventListener("click",()=>{
        if (currentSong.paused){
            currentSong.play()
            play.getElementsByTagName("img")[0].src = "Assets/svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.getElementsByTagName("img")[0].src = "Assets/svg/play.svg"
        }
    })
    
    
    let playbox = document.querySelector(".playbox")
    playbox.querySelector(".controls").querySelector(".seek").addEventListener("click",e=>{
        if (!(currentSong.paused)) {
            a = e.offsetX/e.target.getBoundingClientRect().width
            playbox.querySelector(".controls").querySelector(".seek").querySelector(".done").style.width = `${a*100}%`
            let t = currentSong.duration
            currentSong.currentTime = a * t
        }
    })

    let volume = document.querySelector(".volume")
    volume.querySelector("input").addEventListener("change",(e)=>{
        if (!(currentSong.paused)){
            currentSong.volume = e.target.value/100
            if (e.target.value == 0) {
                volume.querySelector("img").src = "Assets/svg/mute.svg"
            } else if (e.target.value<35){
                volume.querySelector("img").src = "Assets/svg/vol1.svg"
            }else if(e.target.value<80){
                volume.querySelector("img").src = "Assets/svg/vol2.svg"
            }else{
                volume.querySelector("img").src = "Assets/svg/volume.svg"
            }
        }else{
            e.target.value = 100
        }
    })
    
    spotify.querySelectorAll(".second").forEach(e=>{
        e.querySelector(".all").querySelectorAll(".one").forEach(e2=>{
            e2.querySelector("button").addEventListener("click",async()=>{
                p = e2.querySelector("img").alt
                songs = await getSongs(p)
                playSong(songs[0],`${p}/`)
                for (const song of songs){
                    songName = song.split(`${p}/`)[1].replaceAll("%20"," ")
                    a = songName.substring(0,songName.length-4)
                    b = a.split(" by ")[0]
                    c = a.split(" by ")[1]
                    html = `<div class="box">
                    <div class="img">
                    <img src="Assets/photo/${a}.jpeg" alt="${song}">
                    </div>
                    <div class="cont">
                    <div class = "line1">${b}</div>
                    <div class = "line2">${c}</div>
                    </div>
                    <button class="green">
                    <div class="tri"></div>
                    </button>
                    </div>`
                    if (song == songs[0]){
                        scroll.innerHTML= html
                    }else{
                        scroll.innerHTML= scroll.innerHTML + html
                    }
                }
                Array.from(scroll.getElementsByTagName("img")).forEach(e=>{
                    e.parentElement.parentElement.lastElementChild.addEventListener("click" , (ele) => {
                        slink = e.alt
                        sname = e.src.split("/photo/")[1].replace("jpeg","")
                        spath = slink.split(sname)[0]
                        playSong(slink,spath)
                    })
                }) 
            })
        })
    })

    spotify.querySelectorAll(".first").forEach(e=>{
        e.querySelector(".all").querySelectorAll(".one").forEach(e2=>{
            e2.querySelector("button").addEventListener("click",async()=>{
                p = e2.querySelector("img").alt
                r = e2.querySelector("img").src.split("/photo/")[1].replaceAll(" ","%20").replace("jpeg","mp3")
                q = p.split(r)[0]
                songs = await getSongs(q)
                playSong(p,q)
                for (const song of songs){
                    songName = song.split(`${q}`)[1].replaceAll("%20"," ")
                    a = songName.substring(0,songName.length-4)
                    b = a.split(" by ")[0]
                    c = a.split(" by ")[1]
                    html = `<div class="box">
                                    <div class="img">
                                        <img src="Assets/photo/${a}.jpeg" alt="${song}">
                                    </div>
                                    <div class="cont">
                                        <div class = "line1">${b}</div>
                                        <div class = "line2">${c}</div>
                                    </div>
                                    <button class="green">
                                        <div class="tri"></div>
                                    </button>
                            </div>`
                    if (song == songs[0]){
                        scroll.innerHTML= html
                    }else{
                        scroll.innerHTML = scroll.innerHTML + html
                    }
                }
                Array.from(scroll.getElementsByTagName("img")).forEach(e=>{
                    e.parentElement.parentElement.lastElementChild.addEventListener("click" , (ele) => {
                        slink = e.alt
                        sname = e.src.split("/photo/")[1].replace("jpeg","")
                        spath = slink.split(sname)[0]
                        playSong(slink,spath)
                    })
                })        
            })
        })
    })
    
}

main()

document.querySelector(".hamburger").addEventListener("click",() =>{
    document.querySelector(".right").style.opacity = 0.4
    document.querySelector(".left").style.display = "flex"    
})

document.querySelector(".close").addEventListener("click",() =>{
    document.querySelector(".right").style.opacity = 1
    document.querySelector(".left").style.display = "none"    
})
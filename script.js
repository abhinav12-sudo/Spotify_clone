let currentsong = new Audio();
let songs;
let currfolder;
let cardcontainer = document.querySelector(".cardcontainer")
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder){
    currfolder = folder;
    let a= await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`${folder}`)[1])
        }
        
    }
    // show all the songs in the playlists
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML= "";
    for(const song of songs){
        songul.innerHTML = songul.innerHTML + `<li><img src="images/music.svg" alt="" class="invert">
                                <div class="info">
                                    <div>${song.replaceAll("%20"," ")}</div>
                                    <div>Abhinav</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img src="images/play.svg" alt="" class="invert">

                                </div>
                            </li>`;
    }
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })


}
const playmusic = (track,pause = false)=>{
    // let audio = new Audio("/songs/"+track)
    currentsong.src = `${currfolder}` +track
    if(!pause){
        currentsong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayAlbums(){
    let a= await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let folders = []
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a= await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="cs" class="card">
                        <div class="play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`


        }
    }
    // Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })
    
}
async function main(){
    //get the list of all songs
    await getsongs("songs/ncs")
    playmusic(songs[0],true)

    // Display all the albums on the page
    displayAlbums()
    
    // attach an event listener to play, next and previous
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "images/pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "images/play.svg"
        }
    })
    // listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${
            secondsToMinutesSeconds(currentsong.currentTime)} / ${
            secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration)* 100 + "%";
    })
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)* percent)/100; 

    })
    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })
    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    // Add an event listener to previous 
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playmusic(songs[index-1])

        }
    })
    // Add an event listener to next
    next.addEventListener("click",()=>{
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)< songs.length){
            playmusic(songs[index+1])

        }

    })
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100

    })

}
main()

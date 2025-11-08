console.log('Lets write javascript');
async function getsongs(){
    let a= await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs
}
async function main(){
    //get the list of all songs
    let songs= await getsongs()
    // show all the songs in the playlists
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for(const song of songs){
        songul.innerHTML = songul.innerHTML + `<li><img src="music.svg" alt="" class="invert">
                                <div class="info">
                                    <div>${song.replaceAll("%20"," ")}</div>
                                    <div>Abhinav</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img src="play.svg" alt="" class="invert">

                                </div>
                            </li>`;
    }
}
main()

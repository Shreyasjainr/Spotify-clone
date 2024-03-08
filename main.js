let currSng=new Audio()
document.querySelector(".curr").src="img/play.svg"
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
async function song(){
    let a=await fetch("http://127.0.0.1:3000/songs/")
    b=await a.text()
    let div=document.createElement("div")
    div.innerHTML=b;
    let aa=div.getElementsByTagName("a")
    
    let songs=[]
    for (let i = 0; i < aa.length; i++) {
        const element = aa[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1].replaceAll("%20"," "))
        }
    }
return songs
}

const playMusic=(sng,pause=false)=>{
    currSng.src='/songs/'+sng
    if(pause==false){
        currSng.play()
        document.querySelector(".curr").src="img/pause.svg"
    }
    document.querySelector(".info").innerHTML=sng
}

(async function (){
    let songs=await song()
    console.log(songs);
    let n=document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const s of songs) {
        n.innerHTML+=`<li class="flex"><div>${s}</div><div>
        <img src="img/play.svg" class="invert" alt="play">
        </div></li>`
    }
    playMusic(songs[0],true)
    
    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click",n=>{
            console.log(element.firstElementChild.innerHTML);
            playMusic(element.firstElementChild.innerHTML)
        })
    });

    document.querySelector(".curr").addEventListener("click",()=>{

        if(currSng.paused){
            currSng.play()
            document.querySelector(".curr").src="img/pause.svg"       
        }
        else{    
            currSng.pause()
            document.querySelector(".curr").src="img/play.svg"
        }
    })

    prev.addEventListener("click",()=>{
        // console.log(currSng.src.split("/songs/")[1].replaceAll("%20"," "));
        let now=songs.indexOf(currSng.src.split("/songs/")[1].replaceAll("%20"," "))
        if((now-1)>=0){
            playMusic(songs[now-1])
        }
    })
    next.addEventListener("click",()=>{
        // console.log(currSng.src.split("/songs/")[1].replaceAll("%20"," "));      
        let now=songs.indexOf(currSng.src.split("/songs/")[1].replaceAll("%20"," "))
        if((now+1)<songs.length){
            playMusic(songs[now+1])
        }
    })

    
    currSng.addEventListener("timeupdate",()=>{
        // console.log(currSng.currentTime,currSng.duration)
        document.querySelector(".durr").innerHTML=`${secondsToMinutesSeconds(currSng.currentTime)}/${secondsToMinutesSeconds(currSng.duration)}`
        document.querySelector(".circle").style.left=(currSng.currentTime/currSng.duration)*100 + "%";
    })

    document.querySelector(".seek").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currSng.currentTime = ((currSng.duration) * percent) /100;
    })
    
    document.querySelector(".expand").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0+"%";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left=-120+"%";
    })
    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) =>{
        // console.log(e.target.value);
        currSng.volume=parseInt(e.target.value)/100;
    })

}());

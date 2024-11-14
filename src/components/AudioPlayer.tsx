import { Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";

interface CustomAudioPlayerProps {
  url: string;
}
export default function CustomAudioPlayer({ url }: CustomAudioPlayerProps) {
  const playerRef = useRef<ReactPlayer | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [currentTime, setCurrentTime] = useState<string>("00:00");
  const [duration, setDuration] = useState<string>("00:00");

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const handleSeekBack = () => {
    if (playerRef.current) {
      const newTime = Math.max(playerRef.current.getCurrentTime() - 15, 0);
      playerRef.current.seekTo(newTime, "seconds");
    }
  };

  const handleSeekForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(
        playerRef.current.getCurrentTime() + 15,
        playerRef.current.getDuration()
      );
      playerRef.current.seekTo(newTime, "seconds");
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(formatTime(state.playedSeconds));
  };

  const handleDuration = (duration: number) => {
    setDuration(formatTime(duration));
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime("00:00");
    if (playerRef.current) {
      playerRef.current.seekTo(0, "seconds");
    }
  };

  return (
    <>
      <div className="flex flex-row md:fixed md:bottom-5  md:right-10 w-full md:w-auto justify-center items-center  rounded-xl min-h-[2.5rem]  bg-[#171717] text-white mb-2 gap-0  sticky top-[3.75rem] md:top-auto">
        <span className="flex items-center dark:text-white p-2 flex-shrink-0">
          <Sparkles className="mr-2" size={14} />
          Escucha un resumen
        </span>
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          width="0"
          height="0"
          onEnded={handleEnded}
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
        <div
          aria-expanded="false"
          className="flex relative items-center w-auto h-[2.5rem] bg-[#171717] p-2 rounded-lg cursor-pointer text-white gap-2 "
        >
          <button
            onClick={togglePlay}
            type="button"
            className="flex items-center justify-center disabled:text-gray-40 focus-visible:outline-offset-0 rounded-s w-[24px] h-[24px] hover:bg-btn-secondary-base--hover p-1 relative"
            aria-label="Play audio of page text"
          >
            {!playing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                viewBox="0 0 11 14"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M10.174 7.844a1 1 0 0 0 0-1.688L2.037.978A1 1 0 0 0 .5 1.822v10.356a1 1 0 0 0 1.537.844l8.137-5.178Z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                viewBox="0 0 10 12"
                fill="none"
              >
                <rect
                  width="3"
                  height="11"
                  y=".5"
                  fill="currentColor"
                  rx="1.5"
                ></rect>
                <rect
                  width="3"
                  height="11"
                  x="7"
                  y=".5"
                  fill="currentColor"
                  rx="1.5"
                ></rect>
              </svg>
            )}
          </button>
          <span className=" text-md w-10">{currentTime}</span>
          <div className="flex relative gap-1 items-center ml-auto">
            <button
              onClick={handleSeekBack}
              type="button"
              className="flex items-center justify-center disabled:text-gray-40 focus-visible:outline-offset-0 rounded-s w-[24px] h-[24px] hover:bg-btn-secondary-base--hover undefined"
              aria-label="Skip audio backwards 15 seconds"
            >
              <svg
                width="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.59779 3.69627C9.30957 3.49648 9.31121 3.06978 9.60097 2.87223L12.2184 1.08762C12.5503 0.86132 13.0001 1.09902 13.0001 1.50073V2.85564C15.7987 3.98079 17.7719 6.74437 17.7719 9.96938C17.7719 14.1886 14.392 17.6217 10.207 17.6217C6.0219 17.6217 2.64197 14.1886 2.64197 9.96938C2.64197 7.22116 4.07494 4.80911 6.22805 3.45983C6.50884 3.28387 6.87911 3.36885 7.05507 3.64964C7.23104 3.93043 7.14606 4.30071 6.86526 4.47667C5.05158 5.61324 3.84197 7.64691 3.84197 9.96938C3.84197 13.54 6.6987 16.4217 10.207 16.4217C13.7152 16.4217 16.5719 13.54 16.5719 9.96938C16.5719 7.41864 15.1128 5.21756 13.0001 4.16974V5.09969C13.0001 5.50316 12.5468 5.74047 12.2152 5.51062L9.59779 3.69627Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8.54 7.946H9.044V13H8.372V9.304H7.161V8.807L7.7 8.772C8.295 8.73 8.491 8.527 8.54 7.946ZM10.7318 10.662L10.1158 10.557L10.3328 7.974H13.0698V8.562H10.8508L10.7178 10.081C10.9348 9.864 11.2778 9.689 11.7188 9.689C12.6988 9.689 13.3428 10.417 13.3428 11.369C13.3428 12.321 12.5938 13.077 11.5858 13.077C10.6408 13.077 9.95482 12.545 9.77982 11.593L10.4238 11.46C10.5288 12.104 10.9628 12.517 11.5858 12.517C12.2228 12.517 12.7128 12.027 12.7128 11.383C12.7128 10.746 12.2788 10.235 11.6418 10.235C11.2218 10.235 10.8998 10.424 10.7318 10.662Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <button
              onClick={handleSeekForward}
              type="button"
              className="flex items-center justify-center disabled:text-gray-40 focus-visible:outline-offset-0 rounded-s w-[24px] h-[24px] hover:bg-btn-secondary-base--hover undefined"
              aria-label='"Skip audio forwards 15 seconds'
            >
              <svg
                width="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.8085 3.69639C11.0967 3.4966 11.095 3.06991 10.8053 2.87235L8.18786 1.08774C7.85596 0.861443 7.40619 1.09914 7.40619 1.50085V2.85576C4.60759 3.98091 2.63432 6.74449 2.63432 9.9695C2.63432 14.1887 6.01424 17.6219 10.1993 17.6219C14.3844 17.6219 17.7643 14.1887 17.7643 9.9695C17.7643 7.22128 16.3313 4.80923 14.1782 3.45995C13.8974 3.28399 13.5271 3.36897 13.3512 3.64976C13.1752 3.93056 13.2602 4.30083 13.541 4.47679C15.3547 5.61336 16.5643 7.64704 16.5643 9.9695C16.5643 13.5401 13.7076 16.4219 10.1993 16.4219C6.69105 16.4219 3.83432 13.5401 3.83432 9.9695C3.83432 7.41876 5.29344 5.21768 7.40619 4.16986V5.09981C7.40619 5.50328 7.85945 5.7406 8.19104 5.51074L10.8085 3.69639Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8.54 7.946H9.044V13H8.372V9.304H7.161V8.807L7.7 8.772C8.295 8.73 8.491 8.527 8.54 7.946ZM10.7318 10.662L10.1158 10.557L10.3328 7.974H13.0698V8.562H10.8508L10.7178 10.081C10.9348 9.864 11.2778 9.689 11.7188 9.689C12.6988 9.689 13.3428 10.417 13.3428 11.369C13.3428 12.321 12.5938 13.077 11.5858 13.077C10.6408 13.077 9.95482 12.545 9.77982 11.593L10.4238 11.46C10.5288 12.104 10.9628 12.517 11.5858 12.517C12.2228 12.517 12.7128 12.027 12.7128 11.383C12.7128 10.746 12.2788 10.235 11.6418 10.235C11.2218 10.235 10.8998 10.424 10.7318 10.662Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            {/* <button
          type="button"
          className="flex items-center justify-center disabled:text-gray-40 focus-visible:outline-offset-0 rounded-s w-[24px] h-[24px] hover:bg-btn-secondary-base--hover undefined"
          aria-label='"Skip audio forwards 15 seconds'
        >
          IA
        </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

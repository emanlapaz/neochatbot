import { ReactMediaRecorder } from "react-media-recorder";
import MicroPhoneIcon from "./MicrophoneIcon";

type Props = {
  handleStop: any;
};

//record function and pass on button
function RecordChat({ handleStop }: Props) {
  return (
    <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ status, startRecording, stopRecording }) => (
        <div className="mt-2 flex flex-col items-center">
          {" "}
          {/* Added flex properties */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={
              status === "recording"
                ? "bg-red-500 p-4 rounded-full"
                : "bg-white p-4 rounded-full"
            }
          >
            <MicroPhoneIcon
              classText={
                status === "recording"
                  ? "animate-pulse text-black-500"
                  : "text-sky-500"
              }
            />
          </button>
          {/* Audio message */}
        </div>
      )}
    />
  );
}

export default RecordChat;

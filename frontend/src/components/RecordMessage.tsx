import { ReactMediaRecorder } from "react-media-recorder";
import RecordIcon from "./RecordIcon";

type Props = {
  handleStop: any;
};

//record function and pass on button
function RecordMessage({ handleStop }: Props) {
  return (
    <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ status, startRecording, stopRecording }) => (
        <div className="mt-2">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={
              status == "recording"
                ? "bg-red-500 p-4 rounded-full"
                : "bg-white p-4 rounded-full"
            }
          >
            <RecordIcon
              classText={
                status == "recording"
                  ? "animate-pulse text-black-500 "
                  : "text-sky-500"
              }
            />
          </button>
          <p className="mt-2 text-white font-light">{status}</p>
        </div>
      )}
    />
  );
}

export default RecordMessage;

//"bg-white p-4 rounded-full"

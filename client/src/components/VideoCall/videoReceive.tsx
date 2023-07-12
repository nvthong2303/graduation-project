import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    container: {
        position: 'relative',
        display: 'inline-block',
        width: '240px !important',
        height: '240px',
        margin: '0px 5px'
    },
    videoContainer: {
        width: '240px',
        height: '220px',
        backgroundColor: 'black'
    }
});

interface Props {
    name?: string;
    email?: string;
    stream: MediaStream,
    muted?: boolean
}

export default function Video({ stream, muted, name }: Props) {
    const classes = useStyles();
    const ref = React.useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
        if (muted) setIsMuted(muted)
    }, [stream, muted])

    return (
        <div className={classes.container}>
            <video className={classes.videoContainer} ref={ref} muted={isMuted} autoPlay />
            <p style={{ height: '18px', margin: 0 }}>{name}</p>
        </div>
    )
}

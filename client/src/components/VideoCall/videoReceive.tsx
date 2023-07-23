import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    container: {
        position: 'relative',
        display: 'inline-block',
        margin: '0px 5px'
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black'
    }
});

interface Props {
    name?: string;
    email?: string;
    stream: MediaStream,
    muted?: boolean,
    style?: any
}

export default function Video({ stream, muted, name, style }: Props) {
    const classes = useStyles();
    const ref = React.useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
        if (muted) setIsMuted(muted)
    }, [stream, muted])

    return (
        <div className={classes.container} style={style}>
            <video className={classes.videoContainer} ref={ref} muted={isMuted} autoPlay />
            <p style={{ height: '18px', margin: 0, textAlign: 'left' }}>{name}</p>
        </div>
    )
}

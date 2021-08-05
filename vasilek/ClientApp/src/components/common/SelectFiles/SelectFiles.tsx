import React from "react";
import s from './SelectFiles.module.css';
import {Avatar} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

type Props = {
    displayNone: boolean,
    files: File[],
    setFiles: (files: File[]) => void
}

export const SelectFiles: React.FC<Props> = ({displayNone, files, setFiles}) => {
    const deleteClickHandler = (file: File) => {
        let newFiles = [] as File[];
        files.forEach((f,index) => {
            if(file !== f)
                newFiles.push(f)
        })
        setFiles(newFiles);
    }

    return (
        <div className={[s.wrapper_select_files, displayNone ? s.display_none : ''].join(' ')}>
            <div className={s.files}>
                {files && files.map((file, index) =>
                    <div key={index} className={s.file}>
                        <div>{file.name}</div>
                        <button className='classic' onClick={() => deleteClickHandler(file)}>
                            <Avatar size={24} icon={<DeleteOutlined/>}/>
                        </button>
                    </div>)
                }
            </div>
        </div>
    );
}
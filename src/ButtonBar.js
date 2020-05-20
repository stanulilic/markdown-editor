import React from 'react';
import { ReactComponent as ColumnsIcon} from './icons/columns.svg';
import { ReactComponent as EyeIcon} from './icons/eye.svg';
import { ReactComponent as ShowNavIcon} from './icons/chevron-up.svg';
import { ReactComponent as ShowBottomNavIcon} from './icons/chevron-down.svg';

const ButtonBar = () => {
    return (
        <div className="buttonbar">
            <button className="buttonbar__button">
                <ShowNavIcon />
            </button>
            <button className="buttonbar__button">
                <ColumnsIcon />
            </button>
            <button className="buttonbar__button">
                <EyeIcon />
            </button>
            <button className="buttonbar__button">
                <ShowBottomNavIcon />
            </button>

        </div>

    )
}

export default ButtonBar;
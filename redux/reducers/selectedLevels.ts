import { Actions, ActionTypes } from '../actions';
import { Level } from '../../constants/level';

const initialSelectedLevels: Level[] = [];

export const selectedLevels = (selectedLevels = initialSelectedLevels, action: Actions) => {
  switch (action.type) {
    case ActionTypes.SELECT_LEVEL:
      return [...selectedLevels, Level[action.payload]];
    case ActionTypes.DESELECT_LEVEL:
      return selectedLevels.filter((level) => level !== Level[action.payload]);
    default:
      return selectedLevels;
  }
};

import { Action, createReducer, on, createAction, props } from '@ngrx/store';



export const optionFeatureKey = 'option';

export interface OptionState {
  filialname:string
}

export const initialState: OptionState = {
  filialname:""
};

export const LoadOptions = createAction("[APP COMPONENT Load options]");
export const OptionsLoaded = createAction("[APP OPTIONS EFFECT options loaded]",props<{options:OptionState} >());


export const optionReducer = createReducer(
  initialState,
  on(OptionsLoaded, (state:OptionState,action)=> {return {...state,filialname:action.options.filialname }})

);

export function reducer(state: OptionState | undefined, action: Action) {
  return optionReducer(state, action);
}

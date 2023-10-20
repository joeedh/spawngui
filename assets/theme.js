import {CSSFont} from '../lib/pathux.js';
export var theme = {
  base:  {
    AreaHeaderBG        : 'rgba(200, 200, 200, 0.95)',
    BasePackFlag        : 0,
    BoxDepressed        : 'rgba(130,130,130, 1)',
    BoxHighlight        : 'rgba(151,208,239, 1)',
    DefaultText         : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 14,
      color   : 'rgba(35, 35, 35, 1.0)'
    }),
    LabelText           : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 14,
      color   : 'rgba(35, 35, 35, 1.0)'
    }),
    TitleText           : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 12,
      color   : 'rgba(35, 35, 35, 1.0)'
    }),
    'background-color'  : 'rgba(207,207,207, 0.5)',
    'border-color'      : 'rgba(34,34,34, 1)',
    'border-radius'     : 12.010619764585666,
    'flex-grow'         : 'unset',
    'focus-border-width': 2,
    mobileSizeMultiplier: 1,
    oneAxisPadding      : 2,
    padding             : 1,
  },

  button:  {
    DefaultText        : new CSSFont({
      font    : 'poppins',
      weight  : 'bold',
      variant : 'normal',
      style   : 'normal',
      size    : 12,
      color   : 'rgba(35,35,35, 1)'
    }),
    'background-color' : 'rgba(238,238,238, 0.8672412740773168)',
    'border-color'     : 'rgba(190,190,190, 1)',
    'border-radius'    : 4,
    'border-style'     : 'solid',
    'border-width'     : 2,
    disabled           : {
      DefaultText : new CSSFont({
        font    : 'poppins',
        weight  : 'bold',
        variant : 'normal',
        style   : 'normal',
        size    : 12,
        color   : 'rgb(109,109,109)'
      }),
      'background-color' : 'rgb(19,19,19)',
      'border-color' : '#f58f8f',
      'border-style' : 'solid',
      'border-width' : 1,
    },
    height             : 25,
    highlight          : {
      DefaultText : new CSSFont({
        font    : 'poppins',
        weight  : 'bold',
        variant : 'normal',
        style   : 'normal',
        size    : 12,
        color   : 'rgba(255,255,255, 1)'
      }),
      'background-color' : 'rgba(138,222,255, 1)',
      'border-color' : 'rgba(255,255,255, 1)',
      'border-radius' : 4,
      'border-style' : 'solid',
      'border-width' : 2,
    },
    'highlight-pressed': {
      DefaultText : new CSSFont({
        font    : 'poppins',
        weight  : 'bold',
        variant : 'normal',
        style   : 'normal',
        size    : 12,
        color   : 'rgba(35,35,35, 1)'
      }),
      'background-color' : 'rgba(113,113,113, 1)',
      'border-color' : '#DADCE0',
      'border-style' : 'solid',
      'border-width' : 2,
    },
    margin             : 4,
    'margin-left'      : 4,
    'margin-right'     : 4,
    padding            : 1,
    pressed            : {
      DefaultText : new CSSFont({
        font    : 'poppins',
        weight  : 'bold',
        variant : 'normal',
        style   : 'normal',
        size    : 12,
        color   : 'rgba(35,35,35, 1)'
      }),
      'background-color' : 'rgba(113,113,113, 1)',
      'border-color' : '#DADCE0',
      'border-style' : 'solid',
      'border-width' : 2,
    },
    width              : 25,
  },

  checkbox:  {
    CheckSide         : 'left',
    'background-color': 'rgb(168,168,168)',
    height            : 32,
    width             : 32,
  },

  colorfield:  {
    circleSize    : 11,
    colorBoxHeight: 24,
    fieldSize     : 400,
    height        : 256,
    hueHeight     : 32,
    width         : 256,
  },

  colorpickerbutton:  {
    'border-radius': 4,
    height         : 20,
    margin         : 2,
    padding        : 0,
    width          : 40,
  },

  curvewidget:  {
    CanvasBG    : 'rgb(44,44,44)',
    CanvasHeight: 256,
    CanvasWidth : 256,
  },

  dropbox:  {
    dropTextBG: 'rgba(233,233,233, 1)',
    height    : 25,
    width     : 32,
  },

  iconbutton:  {
    'background-color': 'rgba(15,15,15, 0)',
    'border-color'    : 'black',
    'border-radius'   : 5,
    'border-width'    : 1,
    depressed         : {
      'background-color' : 'rgba(42,61,77,0.8)',
      'border-color' : 'black',
      'border-radius' : 5,
      'border-width' : 1,
      height : 32,
      'margin-bottom' : 1,
      'margin-left' : 2,
      'margin-right' : 2,
      'margin-top' : 1,
      padding : 2,
      width : 32,
    },
    height            : 32,
    highlight         : {
      'background-color' : 'rgba(133,182,255,0.8)',
      'border-color' : 'black',
      'border-radius' : 5,
      'border-width' : 1,
      height : 32,
      'margin-bottom' : 1,
      'margin-left' : 2,
      'margin-right' : 2,
      'margin-top' : 1,
      padding : 2,
      width : 32,
    },
    'margin-bottom'   : 1,
    'margin-left'     : 2,
    'margin-right'    : 2,
    'margin-top'      : 1,
    padding           : 2,
    width             : 32,
  },

  iconcheck:  {
    'background-color': 'rgba(15,15,15, 0)',
    'border-color'    : 'rgba(237,209,209, 1)',
    'border-radius'   : 5,
    'border-width'    : 0,
    depressed         : {
      'background-color' : 'rgba(42,61,77,0.8)',
      'border-color' : 'black',
      'border-radius' : 5,
      'border-width' : 1,
      height : 32,
      'margin-bottom' : 1,
      'margin-left' : 2,
      'margin-right' : 2,
      'margin-top' : 1,
      padding : 2,
      width : 32,
    },
    drawCheck         : true,
    height            : 32,
    highlight         : {
      'background-color' : 'rgba(133,182,255,0.8)',
      'border-color' : 'black',
      'border-radius' : 5,
      'border-width' : 1,
      height : 32,
      'margin-bottom' : 1,
      'margin-left' : 2,
      'margin-right' : 2,
      'margin-top' : 1,
      padding : 2,
      width : 32,
    },
    'margin-bottom'   : 1,
    'margin-left'     : 2,
    'margin-right'    : 2,
    'margin-top'      : 1,
    padding           : 2,
    width             : 32,
  },

  label:  {
    LabelText: new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 14,
      color   : 'rgba(35, 35, 35, 1.0)'
    }),
  },

  listbox:  {
    ListActive   : 'rgba(200, 205, 215, 1.0)',
    ListHighlight: 'rgba(155, 220, 255, 0.5)',
    height       : 200,
    width        : 110,
  },

  menu:  {
    MenuBG          : 'rgba(250, 250, 250, 1.0)',
    MenuBorder      : '1px solid grey',
    MenuHighlight   : 'rgba(155, 220, 255, 1.0)',
    MenuSeparator   : {
      'background-color' : 'grey',
      border : 'none',
      height : 2,
      margin : 0,
      padding : 0,
      width : '100%',
    },
    MenuSpacing     : 5,
    MenuText        : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 12,
      color   : 'rgba(25, 25, 25, 1.0)'
    }),
    'border-color'  : 'grey',
    'border-radius' : 5,
    'border-style'  : 'solid',
    'border-width'  : 1,
    'box-shadow'    : '5px 5px 25px rgba(0,0,0,0.75)',
    'item-radius'   : 0,
    'padding-bottom': 0,
    'padding-left'  : 0,
    'padding-right' : 0,
    'padding-top'   : 0,
  },

  notification:  {
    DefaultText       : new CSSFont({
      font    : 'poppins',
      weight  : 'bold',
      variant : 'normal',
      style   : 'normal',
      size    : 12,
      color   : 'rgb(55,55,55)'
    }),
    ProgressBar       : 'rgb(250,132,58)',
    ProgressBarBG     : 'rgb(74,148,183)',
    'background-color': 'rgba(72,72,72,0)',
    'border-color'    : 'grey',
    'border-radius'   : 5,
    'border-style'    : 'solid',
    'border-width'    : 1,
  },

  numslider:  {
    TextBoxWidth      : 30,
    'arrow-color'     : '50%',
    'background-color': 'rgba(219,219,219, 1)',
    'border-color'    : 'black',
    'border-radius'   : 1,
    height            : 22,
    highlight         : {
      DefaultText : new CSSFont({
        font    : 'poppins',
        weight  : 'bold',
        variant : 'normal',
        style   : 'normal',
        size    : 12,
        color   : 'rgb(0,0,0)'
      }),
      'background-color' : 'rgba(151,208,239, 1)',
      'border-color' : 'rgba(255,255,255, 1)',
      'border-style' : 'solid',
      'border-width' : 1,
    },
    pressed           : {
      DefaultText : new CSSFont({
        font    : 'poppins',
        weight  : 'bold',
        variant : 'normal',
        style   : 'normal',
        size    : 12,
        color   : 'rgba(0,0,0, 1)'
      }),
      'arrow-color' : 'rgb(28,28,28)',
      'background-color' : 'rgba(178,178,178, 1)',
      'border-color' : 'rgba(255,255,255, 1)',
      'border-style' : 'solid',
      'border-width' : 1,
    },
    width             : 90,
  },

  numslider_simple:  {
    SlideHeight       : 10,
    TextBoxWidth      : 30,
    addLabel          : true,
    'background-color': 'rgba(238,238,238, 1)',
    'border-color'    : 'rgba(98,98,98, 1)',
    height            : 22,
    labelOnTop        : true,
    width             : 135,
  },

  numslider_textbox:  {
    TextBoxHeight     : 25,
    TextBoxWidth      : 30,
    addLabel          : false,
    'background-color': 'rgba(219,219,219, 1)',
    height            : 25,
    labelOnTop        : true,
    width             : 120,
  },

  panel:  {
    HeaderBorderRadius    : 5,
    HeaderRadius          : 2,
    TitleBackground       : 'rgba(225,225,225, 1)',
    TitleBorder           : 'rgba(104,104,104, 1)',
    TitleText             : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 14,
      color   : 'rgba(0,0,0, 1)'
    }),
    'background-color'    : 'rgba(210,210,210, 0.7594818376068376)',
    'border-color'        : 'rgba(0,0,0, 0)',
    'border-radius'       : 2,
    'border-style'        : 'groove',
    'border-width'        : 1.141,
    'margin-bottom'       : 0,
    'margin-bottom-closed': 0,
    'margin-left'         : 0,
    'margin-right'        : 10,
    'margin-top'          : 0,
    'margin-top-closed'   : 0,
    'padding-bottom'      : 3,
    'padding-left'        : 0,
    'padding-right'       : 2,
    'padding-top'         : 2,
  },

  richtext:  {
    DefaultText       : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 16,
      color   : 'rgba(35, 35, 35, 1.0)'
    }),
    'background-color': 'rgb(245, 245, 245)',
  },

  screenborder:  {
    'border-inner'   : 'grey',
    'border-outer'   : 'rgba(228,228,228, 1)',
    'border-width'   : 2,
    'mouse-threshold': 8,
  },

  scrollbars:  {
    border  : undefined,
    color   : undefined,
    color2  : undefined,
    contrast: undefined,
    width   : undefined,
  },

  sidebar:  {
    'background-color': 'rgba(55, 55, 55, 0.5)',
  },

  strip:  {
    'background-color': 'rgba(75,75,75, 0.33213141025641024)',
    'border-color'    : 'rgba(0,0,0, 0.31325409987877156)',
    'border-radius'   : 8.76503417507447,
    'border-style'    : 'solid',
    'border-width'    : 1,
    'flex-grow'       : 'unset',
    margin            : 2,
    oneAxisPadding    : 2,
    padding           : 1,
  },

  tabs:  {
    TabActive           : 'rgba(212,212,212, 1)',
    TabBarRadius        : 6,
    TabHighlight        : 'rgba(50, 50, 50, 0.2)',
    TabInactive         : 'rgba(183,183,183, 1)',
    TabPadding          : 0,
    TabPadding_mobile   : 20,
    TabStrokeStyle1     : 'rgba(0,0,0, 1)',
    TabStrokeStyle2     : 'rgba(0,0,0, 1)',
    TabText             : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'bold',
      style   : 'normal',
      size    : 15,
      color   : 'rgba(0,0,0, 1)'
    }),
    'background-color'  : 'rgba(222,222,222, 1)',
    'focus-on-tab-click': 'false',
    'movable-tabs'      : 'true',
  },

  textbox:  {
    DefaultText       : new CSSFont({
      font    : 'sans-serif',
      weight  : 'normal',
      variant : 'normal',
      style   : 'normal',
      size    : 14,
      color   : 'rgba(3,3,3, 1)'
    }),
    'background-color': 'rgba(245,245,245, 1)',
    'border-radius'   : 5,
    width             : 150,
  },

  tooltip:  {
    ToolTipText       : new CSSFont({
      font    : 'sans-serif',
      weight  : 'bold',
      variant : 'normal',
      style   : 'normal',
      size    : 12,
      color   : 'rgba(35, 35, 35, 1.0)'
    }),
    'background-color': 'rgba(255,255,255, 1)',
    'border-color'    : 'rgba(139,139,139, 1)',
    'border-radius'   : 3,
    'border-style'    : 'solid',
    'border-width'    : 1,
    padding           : 5,
  },

  treeview:  {
    itemIndent: 10,
    rowHeight : 18,
  },

  vecPopupButton:  {
    height : 18,
    padding: 3,
    width  : 100,
  },

};

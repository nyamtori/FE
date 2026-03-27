import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'KerisKedyuche';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-3@1.0/KERISKEDU_R.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'KerisKedyuche';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-3@1.0/KERISKEDU_B.woff2') format('woff2');
    font-weight: 700;
    font-display: swap;
}

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'KerisKedyuche', sans-serif;
    background-color: #F0F2BD;
  }
`;

export default GlobalStyle;

// const transform = require('css-to-react-native').default

// const res = transform([['fontSize', '13px']])
// console.log(res)

const cheerio = require('cheerio')

const $ = cheerio.load(`<div unique_id="unique_id3">
<button unique_id="unique_id1" class="btn">
  <span unique_id="unique_id2">
  </span>
</button>
<button unique_id="unique_id1" class="btn">
  <span unique_id="unique_id2">
  </span>
</button>
<button unique_id="unique_id1" class="btn">
  <span unique_id="unique_id2">
  </span>
</button>
<button unique_id="unique_id1" class="btn">
  <span unique_id="unique_id2">
  </span>
</button>
</div>`)

$('span[unique_id=unique_id2]').each(function (i, id) {console.log( i)})
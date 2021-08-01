// your account_id
const accountId = 'carto.NVYBik'
//  your map_id
const mapId = 'NxpJokfIoI'
// map configuration
const options = {
  container: 'map',
  center: [18.25, 52.40],
  zoom: 6
};

let mapApi

const authenticator = window.opalSdk.MapAuthenticator.fromUrl(
  `https://map.nmaps.pl/${accountId}/${mapId}`
)


function onCreate(map) {

  mapApi = map
  return map
}


function onError(error) {
  console.log("oups! something goes wrong", error);
}

let popup
let popupValue
var backpack
var dataset1


window.opalSdk
  .createMap(authenticator, options)
  .then(onCreate)
  .then(mapInstance => {


    mapInstance.event$.subscribe((event) => {
      if (event.type === 'load') {

        mapInstance.controls().add('NavigationControl', {
          showZoom: true,
          showCompass: true,
          visualizePitch: true
        }, 'top-right')


        fetch('peak.png')
          .then(response => response.arrayBuffer())
          .then(data => {
            const blob = new window.Blob([new Uint8Array(data)], {
              type: 'image/png',
            })
            return window.createImageBitmap(blob)


          })

          .then(image => mapInstance.images().add('custom-icon', image))


          fetch('gory.geojson')
                      .then(response => response.json())
                      .then(data => {
                        backpack = data;
                        let dataset = window.opalSdk.createDataset('gory', {
                          data: data,
                          cluster: true,
                          clusterMaxZoom: 15,
                          clusterRadius: 100,
                        })
                        return dataset
                      })


                      .then((dataset) => {
                        dataset1 = dataset;
                        mapInstance.addData(dataset, {
                        id: 'clusters',
                        type: 'circle',
                        filter: ['has', 'point_count'],
                        paint: {
                          'circle-color': [
                            'step',
                            ['get', 'point_count'],

                            '#40664a',
                            5,

                            '#295936',
                            10,

                            '#0a3d18',
                          ],
                          'circle-radius': [
                            'step',
                            ['get', 'point_count'],

                            15,
                            5,

                            20,
                            10,

                            30
                          ],
                          'circle-stroke-width': 1,
                          'circle-stroke-color': '#fff',
                        }
                      })
                  
                      mapInstance.addData(dataset, {
                        id: 'cluster-count',
                        type: 'symbol',
                        filter: ['has', 'point_count'],
                        layout: {
                          'text-field': '{point_count_abbreviated}',
                          'text-font': ['Roboto Bold'],
                          'text-size': 14,
                          'text-offset': [0, 0.15],
                        },
                        paint: {
                          'text-color': '#ffffff',
                        },
                      })

                      mapInstance.addData(dataset, {
                        id: 'gory',
                        type: 'symbol',
                        filter: ['!', ['has', 'point_count']],
                        'layout': {
                          'icon-allow-overlap': true,
                          'icon-image': 'custom-icon',
                          'icon-anchor':'bottom'
                        }

                      })
                    })

      }if (event.type === 'mousemove') {

        const layers = ['gory']
        const { x, y } = event.data.point


        const iconCoords =
        [
          [x + 5, y + 5],
          [x - 5, y - 5]
        ]
        const target = mapInstance.query(iconCoords, { layers })

        if (target.length >= 1) {

          if (!popupValue && !popup) {
            popupValue = target[0].properties["Nazwa Szczytu"]
          }

          if (!popup && popupValue) {
            popupValue
              ?
              (popup = window.opalSdk
                .createPopup({
                  closeButton: false,
                  closeOnClick: false,
                })
                .setLngLat(target[0].geometry.coordinates)
                .setHTML(
                  `<div style="font-size: 14px; font-weight: bold;">${
									popupValue
								}</div>`
                )) :
              (popupValue = null)

            mapInstance.addPopup(popup)
          }
          mapInstance.canvas.style.cursor = 'pointer'
        } else if (target.length === 0) {
          mapInstance.canvas.style.cursor = 'default'

          if (popup || popupValue) {
            popup.remove()
            popup = null
            popupValue = null
          }
        }

      }
      if (event.type === 'click') {

  const layers = ['gory']
  const {x,  y } = event.data.point

  const iconCoords =
 [
    [x + 5, y + 5],
    [x - 5, y - 5]
  ]
  const target = mapInstance.query(iconCoords, {  layers })

  if (target.length === 0) return

  const objectProperties = {...target[0].properties}
  const objectGeometry = {...target[0].geometry.coordinates}

var info1 = " <ul> "
for (const property in objectProperties)
{
    if (property != "ikona")
    {
      if (property == "Odznaki Koron ogólnopolskich")
      {
        var badge = objectProperties[property].split(",")

        info1 += `<li>  ${property}: <ul id="badgelist">`
        badge.forEach((item) => {

          if ( item == "Korona Gór Polski")
          {

              info1 += `<li>
               <svg viewBox="0 0 16 16" fill="#10207a">
                  <g transform="translate(.038462 .73077)">
                  <path d="m2 1v6.125c0 4.9 6 7.875 6 7.875s6-2.975 6-7.875v-6.125zm11.143 6.125c0 3.675-3.9429 6.2125-5.1429 6.9125v-12.162h5.1429z" stroke-width=".86602"/>
                  </g>
                </svg> ${item}</li>`
          }else if (item == "Diadem Polskich Gór")
          {
            info1 += `<li>
             <svg viewBox="0 0 16 16" fill="#116617">
                <g transform="translate(.038462 .73077)">
                <path d="m2 1v6.125c0 4.9 6 7.875 6 7.875s6-2.975 6-7.875v-6.125zm11.143 6.125c0 3.675-3.9429 6.2125-5.1429 6.9125v-12.162h5.1429z" stroke-width=".86602"/>
                </g>
              </svg> ${item}</li>`
          }else
          {
            info1 += `<li>
             <svg viewBox="0 0 16 16" fill="#8c0e0e">
                <g transform="translate(.038462 .73077)">
                <path d="m2 1v6.125c0 4.9 6 7.875 6 7.875s6-2.975 6-7.875v-6.125zm11.143 6.125c0 3.675-3.9429 6.2125-5.1429 6.9125v-12.162h5.1429z" stroke-width=".86602"/>
                </g>
              </svg> ${item}</li>`
          }

        });
        info1 += `</ul></li>`

      }else if (property == "Wysokość Góry")
      {
       info1 += `<li>  ${property}: ${objectProperties[property]}m n.p.m. </li>`
      }else
      {
        info1 += `<li>  ${property}: ${objectProperties[property]} </li>`
      }
    }
}
info1 += `<li> <svg viewBox="0 0 32 32" fill="#116617">
 <g data-name="Layer 48">
  <path class="cls-1" d="M16,28A12,12,0,1,1,28,16,12,12,0,0,1,16,28ZM16,6A10,10,0,1,0,26,16,10,10,0,0,0,16,6Z"/>
  <rect class="cls-1" x="15" y="24" width="2" height="7"/>
  <rect class="cls-1" x="15" y="1" width="2" height="7"/>
  <rect class="cls-1" x="24" y="15" width="7" height="2"/>
  <rect class="cls-1" x="1" y="15" width="7" height="2"/>
  <path class="cls-1" d="m16 20a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"/>
 </g>
</svg> ${objectGeometry[0].toFixed(4)},  ${objectGeometry[1].toFixed(4)} </li>`
 info1  += "</ul>"
  var element = document.querySelector("#info");
  element.innerHTML = info1;

  var infobox = document.querySelector("#box");
  infobox.style.left="0px";



}

    })
  })
  .catch(e => console.error('Oups', e.message))


 var closeinfobutton = document.querySelector("#close-info")
 closeinfobutton.addEventListener("click",()=>{
   var infobox = document.querySelector("#box");
       infobox.style.left="-320px";
 })

var filter = {
  "1":1, "2":1, "3":1,
}



   var menubuttons = document.querySelectorAll(".menu-button")
   menubuttons.forEach((button) => {
   button.addEventListener("click",()=>{

     var filterdata =  {
                     "type": "FeatureCollection",
                     "features": []
                       };

    if(filter[button.getAttribute("aria-label")])
    {
      filter[button.getAttribute("aria-label")] = 0;
    }else
     {
      filter[button.getAttribute("aria-label")] = 1;
     }

     for (var i = 0; i < backpack.features.length; i++)
      {
        var flag = 0;
          for(var element in filter)
          {
            if(filter[element])
            {
              var iconbackpack = backpack.features[i].properties.ikona.split("");

              if(iconbackpack.includes(element))
              {
                flag = 1;
                break;
              }
            }
          }
          if(flag)
          filterdata.features.push(backpack.features[i])
      }
      dataset1.setData(filterdata)


   })
 });

 var menuopen = document.querySelector("#menu-open-button")
 var menu = document.querySelector("#menu")

 menuopen.addEventListener("click",()=>{
   if(menu.style.height == "100px")
   {
     menu.style.height = "0px";
   }else
   {
     menu.style.height = "100px";
   }

 })


 var btns = document.getElementsByClassName("menu-button");
 for (var i = 0; i < btns.length; i++) {
 btns[i].addEventListener("click", function(e) {
   console.log(e.target.classList)
   if(e.target.classList.contains("active"))
   {
     e.target.classList.remove("active")
   }else
   {
     e.target.classList.add("active")
   }


  });
}

var infobox = document.querySelector("#legenda");
var openlegendbutton = document.querySelector("#legend-button")
openlegendbutton.addEventListener("click",()=>{
      infobox.style.transform = "scale(1)";
      openlegendbutton.style.display = "none";


})

var closelegendbutton = document.querySelector("#close-legend")
closelegendbutton.addEventListener("click",()=>{
      infobox.style.transform = "scale(0)";
      openlegendbutton.style.display = "block";
})

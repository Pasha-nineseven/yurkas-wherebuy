
function showMap() {
    const mapContainer = document.getElementById('map-offices');
    if (!mapContainer) return;
    
    const infoPanel = document.getElementById('mapInfoPanel');
    const infoPanelTitle = infoPanel ? infoPanel.querySelector('.map-info-panel__title') : null;
    const infoPanelDescription = infoPanel ? infoPanel.querySelector('.map-info-panel__description') : null;
    const infoPanelImage = infoPanel ? infoPanel.querySelector('.map-info-panel__image') : null;
    const infoPanelLinks = infoPanel ? infoPanel.querySelector('.p-offices-list__links') : null;
    const infoPanelClose = infoPanel ? infoPanel.querySelector('.map-info-panel__close') : null;
    
    if (infoPanelClose) {
        infoPanelClose.addEventListener('click', function() {
            infoPanel.style.display = 'none';
            if (window.activePointId !== undefined) {
                objectManager.objects.setObjectOptions(window.activePointId, {
                    iconLayout: markerLayout
                });
                window.activePointId = undefined;
            }
        });
    }
    
    const zoom = 12;
    const map = window.map = new ymaps.Map('map-offices', {
        center: [53.9, 27.56667],
        zoom: zoom,
        controls: []
    }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            clusterDisableClickZoom: false
        });
        const markerLayout = ymaps.templateLayoutFactory.createClass('<svg width="42" height="63" viewBox="0 0 42 63" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5255 63.4734C27.9466 63.4734 33.9466 62.5261 33.9466 61.4208C33.9466 60.3155 27.9466 59.3682 20.5255 59.3682C13.1045 59.3682 7.10449 60.3155 7.10449 61.4208C7.10449 62.5261 13.1045 63.4734 20.5255 63.4734Z" fill="#383938" fill-opacity="0.301961"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.6842 30.9474C40.7368 27.7895 42 24 42 20.0526C42 9 32.6842 0 21 0C9.47368 0 0 9 0 20.0526C0 24 1.26316 27.7895 3.31579 30.9474L19.1053 59.6842C19.8947 61.1053 22.1053 61.1053 22.8947 59.6842L38.6842 30.9474Z" fill="#FFA400"/><path d="M30.6308 14.3684C29.3676 12.1579 27.315 10.579 24.6308 10.2632H24.4729H23.2097C20.9992 10.4211 19.1044 11.5263 17.8413 13.1053L17.6834 13.2632L16.8939 14.3684L16.2623 15.1579L14.5255 17.2106V10.2632H10.5781V26.0527H14.5255V23.2106L15.4729 21.9474L16.2623 21L16.4202 20.6842C16.5781 21.1579 16.736 21.4737 16.8939 21.9474C17.3676 22.8948 18.1571 23.6842 18.9465 24.4737C18.4729 23.6842 18.1571 22.8948 17.8413 21.9474C17.8413 21.7895 17.6834 21.4737 17.6834 21.1579C17.5255 20.2106 17.6834 19.2632 17.9992 18.3158C17.9992 18.1579 17.9992 18.1579 18.1571 18C18.6308 16.7369 19.5781 15.6316 20.6834 15C21.315 14.6842 21.9465 14.3684 22.736 14.2106C22.8939 14.2106 22.8939 14.2106 23.0518 14.2106C23.2097 14.2106 23.3676 14.2106 23.3676 14.2106H23.5255C23.6834 14.2106 23.6834 14.2106 23.8413 14.2106C23.9992 14.2106 23.9992 14.2106 24.1571 14.2106C25.4202 14.3684 26.3676 15.3158 26.8413 16.2632C26.9992 16.7369 27.1571 17.2106 27.1571 17.8421C27.1571 19.8948 25.4202 21.6316 23.3676 21.6316C21.315 21.6316 19.736 19.8948 19.5781 17.8421C19.5781 17.2106 19.736 16.7369 19.8939 16.1053C19.736 16.2632 19.5781 16.4211 19.4202 16.7369C19.1044 17.0527 18.9465 17.5263 18.7887 17.8421C18.315 18.7895 18.1571 19.7369 18.315 20.8421C18.315 21.1579 18.315 21.3158 18.4729 21.6316C18.7887 22.7369 19.2623 23.6842 20.0518 24.4737C20.3676 24.7895 20.8413 25.1053 21.315 25.4211C21.9465 25.579 22.736 25.7369 23.5255 25.7369C24.315 25.7369 25.1044 25.579 25.8939 25.4211C26.8413 25.1053 27.6308 24.7895 28.2623 24.1579C29.0518 23.5263 29.8413 22.7369 30.315 21.7895C30.9465 20.6842 31.2623 19.4211 31.2623 18C31.2623 16.579 30.9465 15.3158 30.315 14.2106L30.6308 14.3684Z" fill="#3D3935"/></svg>');
        const markerActiveLayout = ymaps.templateLayoutFactory.createClass('<svg width="42" height="63" viewBox="0 0 42 63" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5931 63.0001C27.9138 63.0001 34.0143 61.9839 34.0143 60.9678C34.0143 59.7484 27.9138 58.9355 20.5931 58.9355C13.2724 58.9355 7.17188 59.9517 7.17188 60.9678C7.17188 62.1872 13.2724 63.0001 20.5931 63.0001Z" fill="#383938" fill-opacity="0.301961"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.6914 31.0935C40.7249 28.0452 42.1483 24.1839 42.1483 20.1194C42.1483 8.94194 32.7941 0 21.2031 0C9.61201 0 0.257812 8.94194 0.257812 20.1194C0.257812 24.1839 1.47792 27.8419 3.7148 31.0935L19.3729 59.7484C20.1863 61.171 22.4232 61.171 23.2366 59.7484L38.8947 31.0935H38.6914Z" fill="#FFA400"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21.0001 52.6354L34.218 28.4515L34.4214 28.2483C36.0482 25.8096 36.8616 23.1677 36.8616 20.1193C36.8616 11.5838 29.3376 5.08057 21.0001 5.08057C12.6627 5.08057 5.13867 11.3806 5.13867 20.1193C5.13867 22.9644 5.95208 25.8096 7.5789 28.2483L7.78225 28.4515L21.0001 52.6354Z" fill="#FEFEFE"/><path d="M32.1845 15.4451C30.9644 13.2096 28.7275 11.5838 25.8806 11.1773H25.6773H24.2538C22.0169 11.3806 19.9834 12.3967 18.7633 14.0225L18.5599 14.2257L17.7465 15.2419L17.1365 16.0548L15.3063 18.2902V10.9741H11.2393V27.4354H15.3063V24.387L16.3231 23.1677L17.1365 22.1515L17.3398 21.9483C17.5432 22.3548 17.7465 22.7612 17.9499 23.1677C18.5599 24.1838 19.17 24.9967 20.1867 25.8096C19.5767 24.9967 19.3733 24.1838 19.17 23.1677C19.17 22.9644 19.17 22.7612 18.9666 22.3548C18.7633 21.3386 18.9666 20.3225 19.3733 19.5096V19.3064C19.9834 17.8838 20.7968 16.8677 22.0169 16.0548C22.627 15.6483 23.4404 15.4451 24.0504 15.2419H24.2538C24.4571 15.2419 24.4571 15.2419 24.6605 15.2419H24.8638C25.0672 15.2419 25.0672 15.2419 25.2706 15.2419C25.2706 15.2419 25.4739 15.2419 25.6773 15.2419C26.8974 15.4451 27.9141 16.258 28.5242 17.4773C28.7275 17.8838 28.9309 18.4935 28.9309 19.1032C28.9309 21.3386 27.1007 22.9644 25.0672 22.9644C23.0337 22.9644 21.2035 21.1354 21.2035 19.1032C21.2035 18.4935 21.4069 17.8838 21.6102 17.2741C21.4069 17.4773 21.2035 17.6806 21.0002 17.8838C20.7968 18.2903 20.5935 18.6967 20.3901 19.1032C19.9834 20.1193 19.78 21.1354 19.9834 22.1515C19.9834 22.3548 19.9834 22.7612 20.1867 22.9644C20.3901 24.1838 21.0002 25.1999 21.8136 26.0128C22.2203 26.4193 22.627 26.6225 23.0337 26.8257C23.8471 27.029 24.4571 27.2322 25.2706 27.2322C26.084 27.2322 26.8974 27.029 27.7108 26.8257C28.5242 26.6225 29.5409 26.0128 30.151 25.6064C30.9644 24.9967 31.7778 23.9806 32.3879 23.1677C32.9979 21.9483 33.4046 20.729 33.4046 19.3064C33.4046 17.8838 32.9979 16.6644 32.3879 15.4451H32.1845Z" fill="#383938"/></svg>');
        const clusterLayout = ymaps.templateLayoutFactory.createClass('<div class="cluster_custom"><span>$[properties.geoObjects.length]</span>'
        + '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<circle cx="24" cy="24" r="23" fill="white" stroke="#FFA400" stroke-width="1"/>'
        + '</svg>'
        + '</div>');
    objectManager.objects.options.set({
        iconLayout: markerLayout,
        iconPane: 'overlaps',
        openBalloonOnClick: false 
    });
    objectManager.clusters.options.set({
        clusterIconLayout: clusterLayout,
        iconPane: 'overlaps'
    });
    map.geoObjects.add(objectManager);
    
    objectManager.objects.events.add('click', function (e) {
        const objectId = e.get('objectId');
        const obj = objectManager.objects.getById(objectId);
        
        if (obj && infoPanel) {
            if (window.activePointId !== undefined && window.activePointId !== objectId) {
                objectManager.objects.setObjectOptions(window.activePointId, {
                    iconLayout: markerLayout
                });
            }
            
            objectManager.objects.setObjectOptions(objectId, {
                iconLayout: markerActiveLayout
            });
            window.activePointId = objectId;
            
            if (infoPanelImage) {
                if (obj.properties.image) {
                    infoPanelImage.innerHTML = '<img src="' + obj.properties.image + '" alt="">';
                    infoPanelImage.style.display = 'block';
                } else {
                    infoPanelImage.innerHTML = '';
                    infoPanelImage.style.display = 'none';
                }
            }
            if (infoPanelTitle) {
                infoPanelTitle.textContent = obj.properties.name || '';
            }
            if (infoPanelDescription) {
                infoPanelDescription.innerHTML = obj.properties.description || '';
            }
            if (infoPanelLinks) {
                infoPanelLinks.innerHTML = obj.properties.links || '';
            }
            infoPanel.style.display = 'block';
        }
    });
    
    let points = window.mapPoints || [];
    const dataPoints = map.container._parentElement.getAttribute('data-points');
    if (dataPoints) {
        points = JSON.parse(dataPoints);
    }
    
    objectManager.add({
          "type": "FeatureCollection",
          "features": points
        });
    

    const activePoint = map.container._parentElement.getAttribute('data-active-office');
    let activePointObj;
    if (activePoint)
        activePointObj = points.find((obj) => obj["id"] == activePoint);
    console.log("activePointObj")
    console.log(activePointObj)

    const openPoint = map.container._parentElement.getAttribute('data-point-open');
    if (openPoint) {
      const obj = objectManager.objects.getById(openPoint);
      if (obj) {
        const coor = obj.geometry.coordinates;
        goToPlace(coor, 18);
        // custom panel
        if (infoPanel && infoPanelTitle && infoPanelDescription) {
            objectManager.objects.setObjectOptions(openPoint, {
                iconLayout: markerActiveLayout
            });
            window.activePointId = parseInt(openPoint);
            if (infoPanelImage) {
                if (obj.properties.image) {
                    infoPanelImage.innerHTML = '<img src="' + obj.properties.image + '" alt="">';
                    infoPanelImage.style.display = 'block';
                } else {
                    infoPanelImage.innerHTML = '';
                    infoPanelImage.style.display = 'none';
                }
            }
            infoPanelTitle.textContent = obj.properties.name || '';
            infoPanelDescription.innerHTML = obj.properties.description || '';
            if (infoPanelLinks) {
                infoPanelLinks.innerHTML = obj.properties.links || '';
            }
            infoPanel.style.display = 'block';
        }
      }
    }

    function goToPlace(q, z = zoom, idPoint) {
        ymaps.geocode(q).then(
            function (r) {
                const coords = (Array.isArray(q)) ? q : r.geoObjects.get(0).geometry.getCoordinates();
                map.panTo([coords]).then(function() {
                  if (idPoint !== undefined) {
                    // custom panel
                    const obj = objectManager.objects.getById(idPoint);
                    if (obj && infoPanel && infoPanelTitle && infoPanelDescription) {
                        if (window.activePointId !== undefined && window.activePointId !== idPoint) {
                            objectManager.objects.setObjectOptions(window.activePointId, {
                                iconLayout: markerLayout
                            });
                        }
                        objectManager.objects.setObjectOptions(idPoint, {
                            iconLayout: markerActiveLayout
                        });
                        window.activePointId = parseInt(idPoint);
                        if (infoPanelImage) {
                            if (obj.properties.image) {
                                infoPanelImage.innerHTML = '<img src="' + obj.properties.image + '" alt="">';
                                infoPanelImage.style.display = 'block';
                            } else {
                                infoPanelImage.innerHTML = '';
                                infoPanelImage.style.display = 'none';
                            }
                        }
                        infoPanelTitle.textContent = obj.properties.name || '';
                        infoPanelDescription.innerHTML = obj.properties.description || '';
                        if (infoPanelLinks) {
                            infoPanelLinks.innerHTML = obj.properties.links || '';
                        }
                        infoPanel.style.display = 'block';
                    }
                  }
                })
            }
        );
    }
    const find = function (arr, query) {
        return arr.filter(function (obj) {
            if (obj.properties.name)
                return (obj.properties.name).toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };
    const dataZoom = map.container._parentElement.getAttribute('data-zoom');
    const dataCenter = map.container._parentElement.getAttribute('data-center');
    if (dataCenter) {
        let placeZoom = zoom
        if (dataZoom) {
            placeZoom = dataZoom
        }
        goToPlace(JSON.parse(dataCenter), placeZoom);
    }
    const dataCity = map.container._parentElement.getAttribute('data-city');
    if (dataCity) {
        let placeZoom = zoom
        if (dataZoom) {
            placeZoom = dataZoom
        }
        goToPlace(dataCity, placeZoom);
    }
    
    const goToBusLink = document.querySelector('.go-to-bus')
    if (goToBusLink) {
        const stopCoords = [53.849275, 27.473227]
        goToBusLink.addEventListener('click', function () {
            goToPlace(stopCoords, 18);
        })
    }
    const customProvider = {
        suggest: function (query, options) {
            var r = find(points, query),
                arrayResult = [];
            const res = r.filter(el => {
                    return true;
            });
            const results = Math.min(options.results, res.length);
            for (var i = 0; i < results; i++) {
                arrayResult.push({ id: res[i].id, name: res[i].properties.name, description: res[i].properties.description, value: res[i].geometry.coordinates })
            }
            return ymaps.vow.resolve(arrayResult);
        }
    }
    const customResults = ymaps.templateLayoutFactory.createClass(
        '<div class="mapresults {% if state.items.length == 0 %}empty{% endif %}"><ul class="mapresults__inner">{% for item in state.items %}<li class="mapresults__item" data-id="{{ item.id }}" data-value="{{ item.value }}"><span class="mapresults__item-name">{{ item.name }}</span>{{ item.description | raw }}</li>{% endfor %}</ul></div>'
    );
    document.addEventListener('click', function (e) {
        const resultItem = e.target.closest('.mapresults__item');
        if (resultItem) {
            const value = resultItem.getAttribute('data-value');
            const id = resultItem.getAttribute('data-id');
            goToPlace(value, 18, id);
            e.target.closest('.mapresults').classList.add('empty');
            if (document.querySelector("#mapSearch")) {
              document.querySelector("#mapSearch").value = "";
            }
        }
    });

    const searchInput = document.getElementById('mapSearch');
    if (searchInput) {
        const suggestSearch = new ymaps.SuggestView(searchInput, {
            offset: [0, 4],
            provider: customProvider,
            layout: customResults
        });
    }

    const citySelect = document.querySelector('select.offices__city');
    if (citySelect) {
        if (citySelect.classList.contains('city-link__control')) {
            citySelect.addEventListener('change', function (event) {
                window.location.href = event.target.options[event.target.selectedIndex].dataset.link
            })
        } else {
            citySelect.addEventListener('change', function () {
                const city = citySelect.value;
                if (city) {
                    goToPlace(city);
                }
            });
        }
    }
}


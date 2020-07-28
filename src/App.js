import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import './css/App.css'
import html2canvas from 'html2canvas';

import { FormLayout, Snackbar, Select, Input, Div, Panel, Title, Headline, View, FixedLayout, Button, ScreenSpinner, platform, ANDROID } from '@vkontakte/vkui';

import Icon28StoryOutline from '@vkontakte/icons/dist/28/story_outline';
import Icon24ImageFilterOutline from '@vkontakte/icons/dist/24/image_filter_outline';

import skull1 from './img/skull1.svg';
import skull2 from './img/skull2.svg';
import skull3 from './img/skull3.svg';
import skull4 from './img/skull4.svg'
import downwards_black_arrow from './img/downwards-black-arrow.png';
import story_bg from './img/story-bg.jpg';

let group_id = 197437170,
	app_id = 7551802,
	need_sub_group = false;

const os = platform();

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			popout: null,
			activePanel: 'form',
			time: '',
			screen: false,
			scheme: 'bright_light',
			paralel: false,
		};

		this.componentDidMount = this.componentDidMount.bind(this);
		this.initializeApp = this.initializeApp.bind(this);
		this.initializeTimer = this.initializeTimer.bind(this);
		this.go = this.go.bind(this);
		this.generateRandomTime = this.generateRandomTime.bind(this);
		this.updateTime = this.updateTime.bind(this);
	}

	async componentDidMount () {
		console.log(group_id);
		bridge.subscribe(async ({ detail: { type, data }}) => {
			if(type !== undefined) console.log(type, data);
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = false ? data.scheme ? data.scheme : 'bright_light' : 'space_gray';
				document.body.attributes.setNamedItem(schemeAttribute);
				this.setState({ scheme: schemeAttribute.value });
				if(bridge.supports('VKWebAppSetViewSettings')){
					bridge.send('VKWebAppSetViewSettings', {status_bar_style: 'dark', action_bar_color: 'none'});
				}
			}else if (type === 'VKWebAppViewRestore') {
				this.setState({ popout: null, screen: false });
				let shapes = document.getElementsByClassName('bg_shape_container');
				for(let element of shapes){
					try{
						console.log('delete', element);
						element.remove();
					}catch (e) {
						console.error(e);
					}
				}
			}
		});

		this.initializeApp();
	}

	async initializeApp() {
		try{
			let sValues = await bridge.sendPromise('VKWebAppStorageGet', {keys: ['______date1', '______date2', '______reason1', '______reason2']});
			sValues = sValues.keys;
			let data = {};
			try{
				for(let value of sValues){
					data[value.key] = Number(value.value);
				}
			}catch (e) {
				console.error('e3', e)
			}
			this.setState({ data, sValues });

			if(data.______date2 !== false && data.______date2 !== 0){
				console.log('user is not first', data);
				await this.initializeTimer();
				this.go('main');
			}
		}catch (e) {}

        await bridge.send('VKWebAppInit');

		if(need_sub_group){
			try{
				bridge.send('VKWebAppJoinGroup', {group_id: group_id, key: 'fsdgeruiogj'});
			}catch (e) {}
		}
	}

	async initializeTimer() {
		let imgs = [skull1,
			skull2,
			skull3,
			skull4];
		setInterval(()=>{
			try{
				let shape_container = document.createElement('div');
				shape_container.className = 'bg_shape_container';
				let shape = document.createElement('img');
				shape.crossOrigin = 'anonymous';
				shape.className = 'bg_shape light_outline';
				shape.src = imgs[this.random(0, imgs.length)];
				shape.style.left = (this.random(-15, 90)) + 'vw';
				shape_container.appendChild(shape);
				document.getElementById('bg_shapes').appendChild(shape_container);
				for(let i = 0; i < 5; i++){
					shape.style.setProperty('--offset-x-' + i, this.random(-20, 20) +'vw');
				}
				setTimeout(()=>{
					try{
						shape_container.remove();
					}catch (e) {}
				}, 10000);
			}catch (e) {}
		}, 600);
		let generated = await this.generateRandomTime(false);
		this.updateTime();
		await this.sleep(500);
		return true;
	}

	async generateRandomTime(isParalel){
		let reasons = [ ', упав в канализационный люк во время грозы, после перелома позвоночника я захлебнусь от потоков дождевой воды',
			' во время митинга, случайно брошенный камень пробьет мне череп и меня просто не успеют довезти до больницы, так как дороги будут перекрыты',
			' из-за ошибки инструктора, который неправильно уложит стропы моего парашюта',
			' при подъеме на эскалаторе. Резко провалившиеся ступени утянут меня за собой и мои кости перемолет шестернями механизма',
			', поскользнувшись на велодорожке и ударившись о мусорное ведро, которое перебьет мне сонную артерию',
			' от рака яичек',
			' под колесами трамвая, перебегая дорогу и споткнувшись о рельсу',
			' от угарного газа во время пожара в старом заброшенном доме',
			' за рулем каршеринга в состоянии алкогольного опьянения',
			' в результате падения с крыши дачного дома, ремонтируя старую кровлю',
			', пытаясь перелезть забор, запутавшись горлом в колючей проволоке',
			', переплывая водохранилище. Меня утянет на дно водоворотом',
			' в результате укуса клеща, который занесет неизвестную инфекцию',
			' от укуса пчелы, не зная, что у меня была аллергия на их яд',
			' во время футбольного матча, на меня и головы фанатов обвалится кровля стадиона',
			' от удара молнией в мой зонт во время грозы',
			' от сердечного приступа на американских горках',
			' в результате разбойного нападения. От выстрела в бедро я истеку кровью до приезда врачей',
			' в результате прыжка с крыши дома в бассейн, ударившись о бортик головой я потеряю сознание и захлебнусь',
			' во время полета на дельтаплане, оторвавшиеся крепления отсоединят одно из сидений и я рухну на землю',
			' вылетев через отбойники с автострады в результате неудачного обгона',
			' на пешеходном переходе во время грозы, меня придавит рухнувшим светофором',
			' во время спуска со склона, случайно споткнувшись о корень дерева, пролечу 20 метров с переломанной шеей',
			' в резьтате брошенной в мою голову бутылки из окна чей-то квартиры',
			' внутри лифта жилого дома, рухнув с 7-го этажа после обрыва троса',
			' из-за многочисленых переломов в строительном магазине под завалившимися на меня стеллажами с краской',
			' в результате аварии, вылетев через лобовое стекло автомобиля и сломаю шею о бетонный блок',
			', сорвавшись с крыши здания, когда буду делать красивый снимок для инстаграма',
			' от парациантилофилклиникта',
			' от инстивиальной парошемии головного мозга',
			' во время урока химии, случайно загоревшись от газовой горелки',
			' во время правления Путина',
			' от укуса бешеной собаки, так как поздно обращусь в больницу',
			' из-за сорвавшегося домкрата и мне раздавит грудную клетку машиной',
			' на производстве, утянувшая мою куртку церкулярная пила распилит меня на две части',
			' в потасовке около клуба в результате перелома носа произойдет кровоизлияние в мозг',
			' во время взрыва неисправного газового котла',
			' потери крови в результате нападения своры дворовых собак',
			' из-за толпы в метро, случайно сорвавшись с платформы под несущийся поезд',
			' на охоте от случайного выстрела в грудь при встрече с другими охотниками',
			' во время пранка, друзья позовут меня на стрелку, а сами не прийдут, в итоге меня одного изобьют досмерти',
			' во время лучшего минета в жизни от яичного приступа',
			' от голода в лесу, случайно попав в медвежий капкан на охоте',
			' во время 3й мировой войны от радиоактивного излучения',
			' из-за запавшего языка, проснувшись, я задохнусь не сумев вытащить его наружу',
			' от разрыва легких, во время падения со скутера',
			' в открытом море, заснув на надувном матрасе'
		];
		if (!this.state.______reason2) {
			let timeDate = await new Date(Date.now() + this.random(1 * 60 * 60 * 1000, 100 * 365 * 24 * 60 * 60 * 1000)).getTime();
			let data = this.state.data;
			if(this.state.sValues === undefined || data.______date2 == false) {
				let rId = this.random(0, reasons.length);
				await this.setState({reason: reasons[rId]});
				await this.setState({timeDate});
				if(bridge.supports('VKWebAppStorageSet')) {
					try{
						await bridge.sendPromise('VKWebAppStorageSet', {key: '______date1', value: timeDate.toString()});
						await bridge.sendPromise('VKWebAppStorageSet', {key: '______reason1', value: rId.toString()});
						console.log('data saved as standart');

						timeDate = await new Date(Date.now() + this.random(1 * 60 * 60 * 1000, 100 * 365 * 24 * 60 * 60 * 1000)).getTime();
						rId = this.random(0, reasons.length);
						await bridge.sendPromise('VKWebAppStorageSet', {key: '______date2', value: timeDate.toString()});
						await bridge.sendPromise('VKWebAppStorageSet', {key: '______reason2', value: rId.toString()});
						console.log('data saved as paralel');

						let sValues = await bridge.sendPromise('VKWebAppStorageGet', {keys: ['______date1', '______date2', '______reason1', '______reason2']});
						sValues = sValues.keys;
						let data = {};
						try{
							for(let value of sValues){
								data[value.key] = Number(value.value);
							}
						}catch (e) {
							console.error('e3', e)
						}
						this.setState({ data, sValues });
					}catch (e) {console.error('e2',e);}
				}
			}else{
				if (isParalel) {
					await this.setState({______reason2: reasons[data.______reason2]});
					await this.setState({timeDate2: data.______date2});
					console.log('data loaded as paralel');
				} else {
					await this.setState({reason: reasons[data.______reason1]});
					await this.setState({timeDate: data.______date1});
					console.log('data loaded as standart');
				}
			}
		}
		await this.setState({paralel: isParalel});
		return true;
	}
	decOfNum(number, titles){
		let decCache = [],
			decCases = [2, 0, 1, 1, 1, 2];
		if(!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
		return titles[decCache[number]];
	}
	updateTime() {
		setInterval(()=>{
			try{
				let timeMs = (this.state.paralel ? this.state.timeDate2 : this.state.timeDate) - Date.now();

				let years, days, hours, minutes, seconds;
				let yMs = 1000 * 60 * 60 * 24 * 365,
					dMs = yMs / 365,
					hMs = dMs / 24,
					minMs = hMs / 60,
					sMs = minMs / 60;

				years = Math.floor(timeMs / yMs); timeMs -= yMs;
				days = Math.floor(timeMs / dMs) % 365; timeMs -= dMs;
				hours = Math.floor(timeMs / hMs) % 24; timeMs -= hMs;
				minutes = Math.floor(timeMs / minMs) % 60; timeMs -= minMs;
				seconds = Math.floor(timeMs / sMs) % 60; timeMs -= sMs;

				let times = [ [ years, [ 'год', 'года', 'лет' ] ],
						[ days, ['день', 'дня', 'дней'] ],
						[ hours, ['час', 'часа', 'часов'] ],
						[ minutes, ['минута', 'минуты', 'минут'] ],
						[ seconds, ['секунда', 'секунды', 'секунд'] ]],

					timesText = [];

				for(let i = 0; i < times.length; i++){
					if (times[i][0] > 0) timesText.push(times[i][0] + ' ' + this.decOfNum(times[i][0], times[i][1]));
				}

				this.setState({ time: timesText.join(', ') });
			}catch (e) {
				console.error(e);
			}
		}, 500);
	}

	go(panel) {
		this.setState({activePanel: panel});
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	random(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	render() {
		return (
			<View activePanel={this.state.activePanel} popout={this.state.popout}>
				<Panel id='main' style={{ zIndex: 1 }}>
					{
						this.state.screen &&
							<img crossOrigin={'anonymous'} src={story_bg} style={{ height: '100vh', width: '100vw', zIndex: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
					}
					<div style={{ zIndex: 3 }}>
						<div id='bg_shapes'/>
						<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', textAlign: 'center', zIndex: 3 }}>
							<Title level='1' weight='semibold'>Мне осталось <span style={{ backgroundImage: 'linear-gradient(to left, #fc6076 0%, #ff9a44 100%)', color: 'white', lineHeight: '18px', padding: '4px 4px 8px 4px', display: 'inline-block' }}>жить</span></Title>
							<Title level='2' weight='semibold' style={{ marginTop: '12px' }}>{this.state.time}</Title>
							<Headline weight='semibold' style={{ marginTop: '12px', color: 'white', background: 'linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%)', padding: '4px', display: 'inline-block' }}>{ 'Я умру' + ( this.state.paralel ? this.state.______reason2: this.state.reason ) }</Headline><br/>
							<Button before={<Icon24ImageFilterOutline width={20} height={20} style={{ paddingRight: '4px' }}/>} size='l' style={{ marginTop: '12px', display: this.state.screen && 'none' }} onClick={
								async ()=>{
									if(this.state.shared === true){
										await this.generateRandomTime(!this.state.paralel);
									}else{
										this.setState({ snackbar:
												<Snackbar
													layout='vertical'
													onClose={() => this.setState({ snackbar: null })}
												>
													Необходимо сначала поделиться в истории
												</Snackbar>
										});
									}
								}}>{ this.state.paralel ? 'Вернуться' : 'Паралельная вселенная' }
							</Button>
							{
								this.state.screen &&
								<Title level={2} weight='semibold' style={{ position: 'absolute',top: '80%', left: '50%', transform: 'translate(-50%, 0%)', width: '80vw', textAlign: 'center', marginTop: '20vh', color: 'white' }}>
									Переходи в приложение, если не боишься узнать свою дату смерти
									<br/>
									<img crossOrigin={'anonymous'} style={{ marginTop: '12px' }} height='26px' src={downwards_black_arrow}/>
									<img crossOrigin={'anonymous'} height='26px' src={downwards_black_arrow}/>
									<img crossOrigin={'anonymous'} height='26px' src={downwards_black_arrow}/>
								</Title>
							}
						</div>
						<FixedLayout vertical='bottom' style={{ marginBottom: os === ANDROID ? '36px' : '12px', display: this.state.screen && 'none' }}>
							<Div>
								<Button onClick={async ()=>{
									this.setState({ popout: <ScreenSpinner/>, screen: true });
									await this.sleep(250);
									let element = document.getElementsByClassName('View__panels')[0];
									html2canvas(element, { allowTaint: true }).then(async canvas => {
										let blob = canvas.toDataURL('image/png');
										try{
											let resp = await bridge.send('VKWebAppShowStoryBox', { background_type: 'image', blob, attachment: { url: 'https://vk.com/app' + app_id, text: 'open', type: 'url' } });
											this.setState({ shared: true });
										}catch (e) {}
										this.setState({ popout: null, screen: false });
									});
								}} before={<Icon28StoryOutline/>} size='xl' mode='commerce'>Поделиться в истории</Button>
							</Div>
						</FixedLayout>
						{this.state.snackbar}
					</div>
				</Panel>
				<Panel id='form'>
					<FormLayout>
						<Input top='Сколько Вам лет?' type='number' defaultValue={18}/>
						<Select top='Какой Ваш пол?' defaultValue='m'>
							<option value='m'>Мужской</option>
							<option value='f'>Женский</option>
						</Select>
						<Select top='Кто Вы по знаку зодиака?' defaultValue='znak1'>
							<option value='znak1'>Овен</option>
							<option value='znak2'>Телец</option>
							<option value='znak3'>Близнецы</option>
							<option value='znak4'>Рак</option>
							<option value='znak5'>Лев</option>
							<option value='znak6'>Дева</option>
							<option value='znak7'>Весы</option>
							<option value='znak8'>Скорпион</option>
							<option value='znak9'>Змееносец</option>
							<option value='znak10'>Стрелец</option>
							<option value='znak11'>Козерог</option>
							<option value='znak12'>Водолей</option>
							<option value='znak13'>Рыбы</option>
						</Select>
						<Select top='Вас посещали мысли о суициде?' defaultValue='nn'>
							<option value='nn'>Нет</option>
							<option value='yy'>Да</option>
						</Select>
						<Button size='xl' onClick={async ()=>{
							try{
								let resp = await bridge.send('VKWebAppAllowMessagesFromGroup', {group_id: group_id, key: 'fsdgeruiogj'});
								this.setState({ popout: <ScreenSpinner/> });
								await this.initializeTimer();
								this.setState({ popout: null });
								this.go('main');
							}catch (e) {
								this.setState({ snackbar:
										<Snackbar
											layout='vertical'
											onClose={() => this.setState({ snackbar: null })}
										>
											Необходимо разрешение на получение сообщений
										</Snackbar>
								});
							}

						}}>Узнать дату смерти</Button>
					</FormLayout>
					{this.state.snackbar}
				</Panel>
			</View>
		);
	}
}

export default App;
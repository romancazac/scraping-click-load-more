const fs = require('fs');
const puppeteer = require('puppeteer');

let link = '';


const parseNewsWebView = async click =>{
	try{
		
		let browser = await puppeteer.launch({
			headless: true, 
			slowMo: 100, 
			devtools: true
		});
		let page = await browser.newPage();
		
		await page.setViewport({width: 1920, height: 900});

		await page.goto(link, {waitUntil: 'domcontentloaded'});


		// const selector = await page.$('.novisited.g-i-more-link');
		// await selector.click();
		
		
		for(let i = 0; i < click; i++){
			const button = await page.$('.novisited.g-i-more-link');
			await button.click();
		}
		
		// await page.waitForSelector('.g-i-tile.g-i-tile-catalog');
		let html = await page.evaluate(async () =>{

			
			let res = []
			let container = await document.querySelectorAll('.g-i-tile-i-box');

			container.forEach(item => {
				let title = item.querySelector('div.g-i-tile-i-title > a').innerText
				// let code = item.querySelector('span.ty-control-group__item').innerText

				// let code;
				// try{
				// 	code = item.querySelector('span.ty-control-group__item').innerHTML
				// }catch(e){
				// 	code = null;
				// }

				let link = item.querySelector('div.g-i-tile-i-title > a').href
                // let price = item.querySelector('span.ty-price-num').innerText
				
				let price;
				try{
					price = item.querySelector('.g-price-uah').innerHTML
				}catch(e){
					price = null;
				}

				let img;
				try{
					img = item.querySelector('a.responsive-img > img').getAttribute('src')
				}catch(e){
					img = null;
				}
				
				res.push({
					title,
					//  code,
					 link,
                     price,
					img
				});
                console.log(res);
                
			});
            console.log(container);

			return res;
		}); 

		for(let i=0; i < html.length; i++){
			await page.goto(html[i].link, {waitUntil: 'domcontentloaded'});
			await page.waitForSelector('span.detail-code-i').catch(e => console.log(e));
			await page.waitForSelector('table.chars-t').catch(e => console.log(e));
			await page.waitForSelector('div.text-description-content').catch(e => console.log(e));
			// let images = await page.waitForSelectorAll('.detail-img-thumbs-l-i-link').catch(e => console.log(e));
			console.log(i);
			let code = await page.evaluate(async () => {
                
				let code = null
                
				try{
					code = document.querySelector('span.detail-code-i').innerText
                    
				}catch(e){
					code = null;
				}
				return code;
			});
			let article = await page.evaluate(async () => {
                
				let article = null
                
				try{
					article = document.querySelector('table.chars-t').innerText
                    
				}catch(e){
					article = null;
				}
				return article;
			});
			let description = await page.evaluate(async () => {
				let description = null;
				try{
					description = document.querySelector('div.text-description-content').innerText
				}catch(e){
					description = null;
				} 
				return description;
			});

			// images.forEach(items => {
				
			// 		 items = null;
			// 		try{
			// 			items = document.querySelector('.detail-img-thumbs-l-i-link').getAttribute('href')
			// 		}catch(e){
			// 			items = null;
			// 		} 
			// 		return items;
				
			// });
			
		


		
		
			html[i]['code'] = code;
			// html[i]['images'] = images;
			html[i]['caracteristic'] = article;
			html[i]['description'] = description; 
			
		}
		
		// for(let i = 0; i < html.length; i++){
		// 	await page.goto(html[i].link, {waitUntil: 'domcontentloaded'});
		// 	await page.waitForSelector('div.content-description').catch(e => console.log(e));
		// 	console.log(i);
			
		// 	let description = await page.evaluate(async () => {
		// 		let description = null;
		// 		try{
		// 			description = document.querySelector('div.content-description').innerText
		// 		}catch(e){
		// 			description = null;
		// 		} 
		// 		return description;
		// 	});
		// 	html[i]['description'] = description; 
		// }
		
		console.log('news length - ' ,html.length);
		await browser.close();

        fs.writeFile("list.json", JSON.stringify(html), function(err){
            if(err) throw err
            console.log('saved news.json file');	
       });
	 }catch(e){
		console.log(e);
		await browser.close();
	}
    
}

parseNewsWebView(0);
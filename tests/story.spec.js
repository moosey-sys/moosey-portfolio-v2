import {test,expect} from '@playwright/test';
test('engineering story supports keyboard exploration and personal photo previews',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.preloader')).toHaveCount(0);
  await page.getByRole('tab',{name:'Build',exact:true}).click();
  await page.getByRole('tab',{name:'Build',exact:true}).press('ArrowRight');
  await expect(page.locator('#perspective-panel')).toContainText('Windows and Linux');
  await page.getByRole('tab',{name:'Teach',exact:true}).click();
  await expect(page.locator('#perspective-panel')).toContainText('Candellar');
  await page.getByRole('tab',{name:'Cloud 04',exact:true}).click();
  await expect(page.locator('#layer-panel')).toContainText('Huawei Cloud');
  await page.getByRole('tab',{name:'Cloud 04',exact:true}).press('End');
  await expect(page.locator('#layer-panel')).toContainText('Zabbix');
  await page.getByRole('button',{name:'Enlarge: A chapter worth celebrating.'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('src','/assets/graduation.jpeg');
  await page.keyboard.press('Escape');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    await page.locator('#approach').scrollIntoViewIfNeeded();
    await page.screenshot({path:`.local/story-${width}.png`});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.locator('#outside').scrollIntoViewIfNeeded();
    await page.screenshot({path:`.local/personal-${width}.png`});
  }
});

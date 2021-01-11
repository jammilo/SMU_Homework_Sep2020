from splinter import Browser
from bs4 import BeautifulSoup as bs
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import datetime
import time

class ScrapeMars():
    def __init__(self):
        pass

    def init_browser(self):
        # @NOTE: Replace the path with your actual path to the chromedriver
        executable_path = {'executable_path': ChromeDriverManager().install()}
        browser = Browser('chrome', **executable_path, headless=False)
        return browser


    def scrape_info(self):
        # this will be appended Mongo
        scraped_data = {}
        browser = self.init_browser()


        # visit NASA Mars News website
        url = "https://mars.nasa.gov/news/"
        browser.visit(url)
        time.sleep(1)

        # parse results HTML with BeautifulSoup
        soup = bs(browser.html)
        slide = soup.find("li", {"class": "slide"})
        # scrape the latest news title
        news_title = slide.find("div", {"class": "content_title"}).text.strip()
        # scrape the latest paragraph text
        news_p = slide.find("div", {"class": "article_teaser_body"}).text.strip()


        # NEXT, Get FEATURED URL

        # Visit the NASA JPL site
        url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
        browser.visit(url)
        time.sleep(1)
        # use Splinter to visit site and click button with class name
        browser.find_by_id("full_image").click()
        time.sleep(1)
        browser.links.find_by_partial_text("more info").click()
        time.sleep(1)
        soup = bs(browser.html)
        image = soup.find("img", {"class": "main_image"})["src"]
        featured_image_url = f"https://www.jpl.nasa.gov{image}"

        
        # MARS FACTS
        url = "https://space-facts.com/mars/"
        browser.visit(url)
        time.sleep(1)
        dfs = pd.read_html(browser.html)
        df = dfs[0]
        df.columns = ["Statistic", "Value"]
        mars_facts= df.to_html(index=False)


        # HEMISPHERE Data
        url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
        browser.visit(url)
        time.sleep(1)

        hemisphere_data = []

        # get a list of all the hemispheres
        links = browser.find_by_css("a.itemLink.product-item h3")
        for link in range(len(links)):
            hemisphere = {}
            
            # find element to click on each loop
            browser.find_by_css("a.itemLink.product-item h3")[link].click()
            
            # click Sample image and extract <href>
            sample_element = browser.links.find_by_text("Sample")
            hemisphere["img_url"] = sample_element["href"]
            
            # get hemisphere title
            hemisphere["title"] = browser.find_by_css("h2.title").text
            
            hemisphere_data.append(hemisphere)
            
            browser.back()
            
        #exit browser
        browser.quit()

        #append data
        scraped_data["news_title"] = news_title
        scraped_data["news_p"] = news_p
        scraped_data["featured_image_url"] = featured_image_url
        scraped_data["mars_facts"] = mars_facts
        scraped_data["hemispheres"] = hemisphere_data
        scraped_data["last_updated"] = datetime.datetime.now()

        # Return results
        return scraped_data

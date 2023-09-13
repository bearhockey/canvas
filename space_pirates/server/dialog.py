import xml.etree.ElementTree as ET

class Dialog:
    PORTRAIT_URL = "./res/portraits/"

    def __init__(self, idx):
        self.m_idx = idx
        self.m_strText = ""
        self.m_strPortrait = ""
        self.m_arrChoice = []

        self.LoadData()
    
    def LoadData(self):
        dialog_tree = ET.parse("../data/dialog.xml")
        dialog_root = dialog_tree.getroot()
        for dialog_tag in dialog_root.findall('dialog'):
            dialog_id = dialog_tag.find('id').text
            if dialog_id == str(self.m_idx):
                d_text = dialog_tag.find('text')
                self.m_strText = d_text.text if d_text is not None else ""
                d_portrait = dialog_tag.find('portrait')
                self.m_strPortrait = d_portrait.text if d_portrait is not None else ""

                self.m_arrChoice = []
                for d_choice in dialog_tag.findall('choice'):
                    objChoice = {}
                    choice_id = d_choice.find('next')
                    objChoice['next'] = choice_id.text if choice_id is not None else None
                    choice_text = d_choice.find('text')
                    objChoice['text'] = choice_text.text if choice_text is not None else None
                    self.m_arrChoice.append(objChoice)
                
                break
    
    def GetData(self):
        strPortraitIcon = self.PORTRAIT_URL + self.m_strPortrait + ".png" if self.m_strPortrait != "" else ""
        return { 'strText':self.m_strText, 'strPortraitIcon':strPortraitIcon, 'arrChoices':self.m_arrChoice }

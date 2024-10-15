import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Button, List, ListItem, ListItemText, TextField, Drawer, Stack } from '@mui/material';
import { useDocument, resetDocument, setDocument, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { v4 as uuidv4 } from 'uuid';
import { Delete } from '@mui/icons-material';

export const SAMPLES_DRAWER_WIDTH = 240;

const TemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [currentTemplateName, setCurrentTemplateName] = useState('');
    const [isNewTemplate, setIsNewTemplate] = useState(true);
    const document = useDocument();
    const samplesDrawerOpen = useSamplesDrawerOpen();

    useEffect(() => {
        const storedTemplates = JSON.parse(localStorage.getItem('htmlTemplates') || '[]');
        setTemplates(storedTemplates);
    }, []);

    const generatedHtml = useMemo(() => {
        if (document && document.root) {
            try {
                const renderedHtml = renderToStaticMarkup(document, { rootBlockId: 'root' });
                console.log('Generated HTML:', renderedHtml);
                return renderedHtml;
            } catch (error) {
                console.error('Error rendering HTML:', error);
                return 'Error rendering HTML';
            }
        }
        return '';
    }, [document]);

    const saveTemplate = useCallback(() => {
        console.log('TemplateManager: saveTemplate called');
        if (currentTemplateName.trim() === '') {
            alert('Please enter a template name');
            return;
        }

        if (!document || !document.root) {
            alert('Unable to save template: Invalid document structure');
            return;
        }

        console.log('TemplateManager: Current document state:', document);
        console.log('TemplateManager: Generated HTML:', generatedHtml);

        const newTemplate = {
            id: isNewTemplate ? uuidv4() : templates.find(t => t.name === currentTemplateName)?.id,
            name: currentTemplateName,
            json: document,
            html: generatedHtml,
        };

        let updatedTemplates;
        if (isNewTemplate) {
            updatedTemplates = [...templates, newTemplate];
        } else {
            updatedTemplates = templates.map(template =>
                template.name === currentTemplateName ? newTemplate : template
            );
        }

        setTemplates(updatedTemplates);
        localStorage.setItem('htmlTemplates', JSON.stringify(updatedTemplates));
        setIsNewTemplate(false);

        // Store HTML in local storage
        localStorage.setItem(`html_${newTemplate.id}`, generatedHtml);
        console.log('HTML stored in local storage with key:', `html_${newTemplate.id}`);
        console.log('Stored HTML content:', generatedHtml);
    }, [currentTemplateName, document, isNewTemplate, templates, generatedHtml]);

    const loadTemplate = (template) => {
        if (template && template.json && template.json.root) {
            setDocument(template.json);
            setCurrentTemplateName(template.name);
            setIsNewTemplate(false);
        } else {
            alert('Unable to load template: Invalid template structure');
        }
    };

    const createNewTemplate = () => {
        if (currentTemplateName.trim() === '') {
            alert('Please enter a template name');
            return;
        }
        saveTemplate();
        window.location.reload();
    };

    const deleteTemplate = (templateToDelete) => {
        const updatedTemplates = templates.filter(template => template.name !== templateToDelete.name);
        setTemplates(updatedTemplates);
        localStorage.setItem('htmlTemplates', JSON.stringify(updatedTemplates));
        if (currentTemplateName === templateToDelete.name) {
            createNewTemplate();
        }
    };

    const viewHtml = (template) => {
        const storedHtml = localStorage.getItem(`html_${template.id}`);
        if (storedHtml) {
            console.log('Stored HTML for template:', template.name);
            console.log(storedHtml);
        } else {
            console.log('No stored HTML found for template:', template.name);
        }
    };

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={samplesDrawerOpen}
            sx={{
                width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
            }}
        >
            <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
                <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
                    <Box>
                        <TextField
                            label="Template Name"
                            value={currentTemplateName}
                            onChange={(e) => setCurrentTemplateName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

                        <Button onClick={createNewTemplate} variant="contained" color="primary" style={{ marginRight: '10px' }}>
                            Create New Template
                        </Button>
                        {!isNewTemplate && (
                            <Button onClick={saveTemplate} variant="contained" color="secondary" sx={{ marginTop: '10px' }}>
                                Save Current Template
                            </Button>
                        )}

                        <List>
                            {templates.map((template, index) => (
                                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', px: 0 }}>
                                    <Button
                                        onClick={() => loadTemplate(template)}
                                        style={{ textAlign: 'left', width: '75%' }}
                                    >
                                        <ListItemText primary={template.name} />
                                    </Button>
                                    
                                        <Delete sx={{ color: 'red',cursor: 'pointer' }}  onClick={() => deleteTemplate(template)}/>
                                    
                                </ListItem>
                            ))}
                        </List>

                    </Box>
                </Stack>
            </Stack>
        </Drawer>
    );
};

export default TemplateManager;